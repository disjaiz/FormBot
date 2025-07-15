import React , {useState} from 'react'
import styles from "./Login.module.css";
import triangle from '../Images/triangle.png';
import triangleTwo from '../Images/triangleTwo.png';
import rightSeiCircle from '../Images/semicircelRight.png';
import bottomSemiCircle from '../Images/semicircleDown.png';
import googleIcon from '../Images/googleIcon.png';
import googleIconBg from '../Images/googleLogoBg.png';
import backArrow from '../Images/arrowBack.png';
import { useNavigate,  useLocation } from 'react-router-dom';
import {login} from '../FetchMakers';
import { findWorkspace } from '../FetchMakers';
import Toast from '../Toast';

import Cookies from 'js-cookie';
function Login() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const location = useLocation(); 
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [loading, setLoading] = useState(false);


  // handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return; // 🔒 Prevent multiple clicks
    setLoading(true);

    try{
      const response = await login(formData);
      const logindata = await response.json();

      if (response.status === 200) {
         console.log("logged n----------------======-=============")

      // Find workspace 
      const Wresponse = await findWorkspace();
      const workspaceData = await Wresponse.json();

      if (Wresponse.status === 200) {
        // console.log(workspaceData.workspace.workspaceName);
        const token = Cookies.get('Token');

        // Get returnUrl from query params
        const returnUrl = new URLSearchParams(location.search).get('returnUrl') || null ;

        // Redirect to the returnUrl or the default workspace page
        if (returnUrl){ 
          navigate(returnUrl);
        }

        else {
          navigate('/userWorkspace',  { state: { username: workspaceData.workspace.workspaceName }});
        }
       
      } else {
        setToast('Error finding workspace!');
      }
      }
      else if (response.status === 400) {
        setError(logindata.msg || "Unknown error.");
        console.log(logindata);
      } 
      else {
        setError("Something went wrong. Please try again.");
        console.error(logindata);
      }
  }
  catch(err){
      switch (err.message) {
            case "network_error":
              setError("No internet or server is unreachable.");
              break;
            default:
              setError("Unexpected error. Please try again later.");
          }
  }
  finally {
    setLoading(false); // 🧹 Always release lock, success or fail
  }
  };

  // handle register
  const handleRegister = () => {
    navigate('/signup');
  };

  return (
    <div className={styles.container}>
          {toast && (
        <Toast
          message={toast}
          duration={3000}
          onClose={() => setToast(null)}
          bgColor={"red"}
        />
      )}

      <form onSubmit={handleLogin} className={styles.form}>
        <label htmlFor="email" className={styles.lable}>Email</label><br/>
        <input required type="email" name='email' placeholder='Enter your email' className={styles.inputField}
          value={formData.email} onChange={(e) => setformData({ ...formData, [e.target.name]: e.target.value })}/><br/>

        <label htmlFor="password" className={styles.lable}>Password</label><br/>
        <input required type="password" name="password" id="pass" placeholder='Password' className={styles.inputField}
          value={formData.password} onChange={(e) => setformData({ ...formData, [e.target.name]: e.target.value })}/><br />

        <button type='submit' className={styles.buttons}>Log in</button><br/>
            {error && <p style={{ color: "red" , fontWeight: "300"}}>{error}</p>}
        <div style={{ textAlign: 'center', fontSize: '13px', marginTop: '5px' }}><span>OR</span></div><br/>

        <button type="button" className={styles.buttons}>
          <div className={styles.gImgBg}>
            <img src={googleIcon} alt="googleicon" className={styles.gImgFront}/> 
          </div>
          Sign in with Google
        </button><br/>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px' }}>Don't have an account? <span style={{ color: '#1A5FFF' }} onClick={handleRegister}>Register now</span></p>
        </div>
      </form>

      <img src={backArrow} alt="go-back" className={styles.backArrowImg} onClick={() => navigate(-1)}/>
      <img src={triangle} alt="triangle" className={styles.triangeImg}/>
      <img src={triangleTwo} alt="triangle" className={styles.triangeImgTwo}/>
      <img src={rightSeiCircle} alt="right-semi-circle" className={styles.rightSemiCircle}/>
      <img src={bottomSemiCircle} alt="bottom-semi-circle" className={styles.bottomSemiCircle}/>
    </div>
  );
}



export default Login
