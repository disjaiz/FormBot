import React from 'react';
import styles from './FolderModal.module.css';

const FormDeleteModal = ({ isOpen, onClose, onConfirm,  isLight}) => {
  if (!isOpen) return null; 

  const handleConfirm = () => {
    onConfirm(); 
    onClose(); 
  };

  return (
    <div className={styles.container}>
      <div className={styles.deleteModal}  style={{backgroundColor: isLight ? 'white': '#090909'}}>
        <p className={styles.heading} style={{color: isLight && 'black'}}>Are you sure you want to delete the form?</p>
        <div className={styles.btnDiv}>
          <button onClick={handleConfirm} className={styles.done} style={{backgroundColor: isLight ? 'white': '#090909'}}>Confirm</button>
          <button onClick={onClose} className={styles.cancel} style={{backgroundColor: isLight ? 'white': '#090909', color: isLight? 'black': 'white'}}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default FormDeleteModal ;