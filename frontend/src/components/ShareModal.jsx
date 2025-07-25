import React, { useState } from "react";
import styles from "./ShareModal.module.css";
import closeImg from '../Images/close.png';

const ShareModal = ({ workspaceId, closeModal , isLight, setToast }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [email, setEmail] = useState("");
    const [accessLevel, setAccessLevel] = useState("edit");
    const [link, setLink] = useState('');
 
  const handleSendInvite = async () => {
    try {
        const response = await fetch(`${backendUrl}/workspace/${workspaceId}/invite`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify({ email, accessLevel }),
        });
        const res = await response.json();
    if (response.status === 200) {
        setToast({message:"Invite sent successfully!", bg:"green"});
    }
    else{
        console.log(res.message);
        setToast({message:res.message, bg:"red"});
        }
        
    } catch (error) {
        console.error(error);
        setToast("Failed to send invite");
    }
};

    // Handle generating a shareable link
    const handleGenerateLink = () => {
        const generatedLink = `${backendUrl}/login?returnUrl=/workspace/${workspaceId}/join?accessLevel=${accessLevel}`;
        setLink(generatedLink);
        navigator.clipboard.writeText(generatedLink);
        setToast({message:"Link copied!", bg:"green"});
    };

return (
        <div className={styles.modal}>
            <div className={styles.modalContent}  style={{backgroundColor: isLight ? 'white': '#090909'}}>

                <img src={closeImg} alt="closebtnImg" className={styles.closeButton} onClick={closeModal}/>
                
                <div className={styles.modalBody}>

                <div className={styles.dropdown}>
                            <select
                                value={accessLevel}
                                onChange={(e) => setAccessLevel(e.target.value)}
                                className={styles.select}
                                style={{backgroundColor: isLight ? 'white': '#090909',color: isLight? 'black':'white', border: isLight? '1px solid #c7c4c4': '1px solid #444',}}
                            >
                                <option value="edit">Edit</option>
                                <option value="view">View</option>
                            </select>
                        </div>

                    <div className={styles.section}>
                        <p style={{fontFamily:'Open Sans', fontSize:'20px',color: isLight? 'black':'white'}}>Invite by Email</p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email id"
                            className={styles.input}
                            style={{backgroundColor: isLight ? 'white': '#090909',color: isLight? 'black':'white', border: isLight? '1px solid #c7c4c4': '1px solid #444',}}
                        />
                       
                        <button onClick={handleSendInvite} className={styles.button}>
                            Send Invite
                        </button>
                    </div>
                    <div className={styles.section}>
                        <p style={{fontFamily:'Open Sans', fontSize:'20px',color: isLight? 'black':'white'}}>Invite by Link</p>
                        <button onClick={handleGenerateLink} className={styles.button}>
                            Copy Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;

