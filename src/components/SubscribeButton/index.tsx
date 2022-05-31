import React from 'react';

import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ priceId }) => {
  return (
    <button className={styles.subscribeButton}>
      Subscribe now
    </button>
  )
}

export default SubscribeButton;