import React from 'react';

import { useSession, signIn } from 'next-auth/react';
import styles from './styles.module.scss'
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

interface SubscribeButtonProps {
  priceId: string;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ priceId }) => {

  const { data: session } = useSession()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <button 
      className={styles.subscribeButton}
      type='button'
      onClick={handleSubscribe}
      >  
      Subscribe now
    </button>
  )
}

export default SubscribeButton;