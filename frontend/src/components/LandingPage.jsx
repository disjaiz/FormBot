import React from 'react'
import semiCircle from '../Images/semiCircle.png';
import heroImg from '../Images/Container.png';
import formbotlogo from '../Images/formbot-logo.png';
import styles from "./LandingPage.module.css";
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  }

  return (
    <div className={styles.container}>
        {/* ----------------navbar----------------- */}
        <nav className={styles.navbar}  >
          <div className="logo">
            <img src={formbotlogo} alt="FormBot Logo" className="logo-img" />
          </div>

          <div className={styles.navButtons}>
            <button className={styles.signIn} onClick={handleLogin}>Sign in</button>
            <button className={styles.createFormbot} onClick={handleLogin}>Create a FormBot</button>
          </div>
        </nav>

        {/* ----------------hero----------------- */}
        <div className={styles.hero}>
        <img src={semiCircle} alt="semicirlce" className={styles.semiCircle}/>
        <img src={heroImg} alt="hero Logo" className={styles.heroImg} />
        </div>
      
        {/* ----------------footer----------------- */}
        <div  className={styles.footer}>
          <div className={styles.footerSubDiv}>

            <ul className={styles.footerList}> 
              <li className={styles.listHeading}>FormBot</li>
              <li>Made with ❤️ by</li>
              <li> Siddhi</li>
            </ul>
            <ul className={styles.footerList} >
                <li className={styles.listHeading}>Product</li>
                <li>Status &nbsp;<i className="fa-solid fa-arrow-up-right-from-square" style={{color: '#ffffff'}}></i></li>
                <li>Documentation &nbsp;<i className="fa-solid fa-arrow-up-right-from-square" style={{color: '#ffffff'}}></i></li>
                <li>Roadmap &nbsp; <i className="fa-solid fa-arrow-up-right-from-square" style={{color: '#ffffff'}}></i></li>
                <li>Pricing</li>
            </ul>
            <ul className={styles.footerList}>
              <li className={styles.listHeading}>Community</li>
              <li>Discord &nbsp; <i className="fa-solid fa-arrow-up-right-from-square" style={{color: '#ffffff'}}></i></li>
              <li>GitHub Repository &nbsp;<i className="fa-solid fa-arrow-up-right-from-square" style={{color: '#ffffff'}}></i></li>
              <li>Twitter &nbsp;<i className="fa-solid fa-arrow-up-right-from-square" style={{color: '#ffffff'}}></i></li>
              <li>Linkdin &nbsp;<i className="fa-solid fa-arrow-up-right-from-square" style={{color: '#ffffff'}}></i></li>
              <li>OSS Friends</li>
            </ul>
            <ul className={styles.footerList}>
              <li className={styles.listHeading}>Company</li>
              <li>About</li>
              <li>Contact</li>
              <li>Terms of Service</li>
              <li>Privacy Policy </li>              
            </ul>
          </div>
        </div>
    </div>
  )
}

export default LandingPage
