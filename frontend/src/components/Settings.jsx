import React, {useState} from 'react'
import styles from './Settings.module.css'
import logout from '../Images/logout.png';
import { useNavigate , useLocation} from 'react-router-dom';


function Settings() {
     const url = "https://formbot-backend-vlhw.onrender.com";
     const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const location = useLocation();
    const { isLight } = location.state || {isLight: false  }; 

// ===============================================================================================
 const handleUpdate = async (e) => {
    e.preventDefault();
    if (oldPassword || newPassword) {
      if(oldPassword === newPassword){
        alert('New password cannot be the same as old password.');
        return;
      }
      if (!oldPassword || !newPassword) {
        alert("Both Old and New passwords are required if changing password.");
        return;
      }
      if (!name || !email) {
        alert('Name and Email are required when changing the password.');
        return;
  } }
    const updatedData = { name, email, oldPassword, newPassword};
    try {
      const response = await fetch(`${url}/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('User updated:', data);
      } 
      else {
        const errorData = await response.json();
        if (response.status === 400) {
          alert(`Error: ${errorData.err}`);
        } 
        else if (response.status === 500) {
          alert('An unexpected error occurred. Please try again later.');
        }
        else if (response.status === 401) {
          alert(`Error: ${errorData.err}`);
      }
    } }
    catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }

    console.log('Updated data:', updatedData);
    setName('');
    setEmail('');
    setOldPassword('');
    setNewPassword('');
  };
// ============================================================================================================
  const handleLogout = async () => {
    try {
      const response = await fetch(`${url}/user/logout`, {
        method: 'POST',
        credentials: 'include', 
      });
      const data = await response.json();
      console.log(data)
      if (response.ok) {
       navigate('/');
      } else {
        console.log('Logout failed'); }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  // ======================================================================================
  return (
    <div className={styles.container} style={{backgroundColor: isLight? 'white': '#121212'}}>
      <div className={styles.innerContainer}>
          <p className={styles.header} style={{ color: isLight? 'black': 'white'}}> Settings</p>

          <form className={styles.updateForm}>

              <input type="text" id="name" name="name" className={`${styles.input} ${styles.personIcon}`} placeholder='Name' 
               value={name} onChange={(e) => setName(e.target.value)} style={{ color: isLight? 'black': 'white'}}/> <br />
              
              <input type="email" id="email" name="email" className={`${styles.input} ${styles.lockIcon}`} placeholder='Update Email'
                value={email} onChange={(e) => setEmail(e.target.value)} style={{ color: isLight? 'black': 'white'}}/> <br />
              
              <input type="password" id="oldPassword" name="oldPassword" className={`${styles.input} ${styles.lockIcon}`} 
              placeholder='Old Password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={{ color: isLight? 'black': 'white'}}/> <br />
              
              <input type="password" id="newPassword" name="newPassword" className={`${styles.input} ${styles.lockIcon}`} 
              placeholder='New Password'  value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ color: isLight? 'black': 'white'}}/>  <br />
             
              <button onClick={handleUpdate} className={styles.updatebtn}>Update</button>
          </form>

      </div>

      <img src={logout} alt="logoutImg" className={styles.logoutImg} onClick={handleLogout}/>
    </div>
  )
}

export default Settings
