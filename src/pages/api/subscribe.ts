/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if(request.method === 'POST') {

    const session = await getSession({ req: request })

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )

    let customerId = user.data.stripe_customer_id

    if(!customerId) {
      const StripeCustomer = await stripe.customers.create({
        email: session.user.email
      })

      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: StripeCustomer.id
            }
          }
        )
      )

      customerId = StripeCustomer.id
    }

  
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1L5IytAXQT3jfDk8eb9JX5ij', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return response.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    response.setHeader('Allow', 'POST')
    response.status(405).end('Method now allowed.')
  }
}