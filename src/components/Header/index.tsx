import React from 'react';

import SignInButton from '../SignInButton';

import styles from './styles.module.scss'

const Header: React.FC = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ignews" />
        <nav>
          <a>Home</a>
          <a>Posts</a>
        </nav>

        <SignInButton></SignInButton>
      </div>
    </header>
  )
}

export default Header;