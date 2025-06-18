import React, { useEffect, useState } from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, duration = 3000, onClose, bgColor }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 1000); // delay so fade-out can play
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    visible && (
      <div className={styles.toast} style={{backgroundColor: bgColor}}>
        {message}
      </div>
    )
  );
}
