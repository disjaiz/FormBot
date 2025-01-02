import React, { useState } from 'react';
import styles from './FolderModal.module.css';

const FolderModal = ({ isOpen, onClose, onSubmit , isLight}) => {
  const [folderName, setFolderName] = useState('');

  if (!isOpen) return null; 

  const handleSubmit = () => {
    if (folderName.trim()) {
      onSubmit(folderName); 
      setFolderName('');
      onClose(); 
    } else {
      alert('Folder name cannot be empty');
    }
  };

  return (
     <div className={styles.container} >
    <div className={styles.createModal} style={{backgroundColor: isLight ? 'white': '#090909'}}>
      <p className={styles.heading}  style={{color: isLight && 'black'}} >Create New Folder</p>
      <input
       style={{
        backgroundColor: isLight ? '#ffffff' : '#333333',  
        color: isLight ? 'black' : 'white', 
        border: isLight? '1px solid grey': 'none',
      }}        
        type="text"
        placeholder="Enter folder name"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        className={styles.input}
      />
      <div className={styles.btnDiv}>
          <button onClick={handleSubmit} className={styles.done} style={{backgroundColor: isLight ? 'white': '#090909'}}>Done</button>
          <button onClick={onClose} className={styles.cancel} style={{backgroundColor: isLight ? 'white': '#090909', color: isLight? 'black': 'white'}}>Cancel</button>
      </div>
     
    </div>
  </div>
  );
};

export default FolderModal;
