import React, { useEffect, useState } from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, duration = 30000, onClose, bgColor }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 1000); // delay for fade-out
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // shorter fade on manual close
  };

  return (
    visible && (
      <div className={styles.toast} style={{ backgroundColor: bgColor }}>
        <span>{message}</span>
        <button className={styles.closeBtn} onClick={handleClose}>×</button>
      </div>
    )
  );
}
