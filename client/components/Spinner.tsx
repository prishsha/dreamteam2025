import React from 'react';
import styles from '@/components/Spinner/Spinner.module.css';

const Spinner: React.FC = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Spinner;
