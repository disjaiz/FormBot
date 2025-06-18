import React, {useState} from 'react'
import styles from "./Login.module.css";

import triangle from '../Images/triangle.png';
import triangleTwo from '../Images/triangleTwo.png';
import rightSeiCircle from '../Images/semicircelRight.png';
import bottomSemiCircle from '../Images/semicircleDown.png';
import googleIcon from '../Images/googleIcon.png';
import googleIconBg from '../Images/googleLogoBg.png';
import backArrow from '../Images/arrowBack.png';

import { useNavigate } from 'react-router-dom';

import signup from '../FetchMakers';
import { createWorkspace } from '../FetchMakers';
import Toast from '../Toast';

function Signup() {
   const url = import.meta.env.VITE_BACKEND_URL;
   const navigate = useNavigate();
   const [formData, setformData] = useState({
    username:"",
    email: "",
    password: "",
    confirmPassword: ""
  })
   const [error, setError] = useState(null);
   const [toast, setToast] = useState(null);
      // handle signup=======================================
       const handleSignup = async (e) => {
        e.preventDefault()
        
      try{
        const response = await signup(formData)
        const signupData = await response.json();

        if (response.status === 200) {

              // create workspace
              // const Wresponse = await createWorkspace({workspaceName: formData.username, userId: signupData.user._id})
              const Wresponse = await createWorkspace();
              const data = await Wresponse.json();

              if (Wresponse.status === 200) {
                navigate('/userWorkspace',  { state: { username: formData.username }});
              }
              else if (Wresponse.status === 400) {
                setToast('Error in input data!');
                console.log(data)
              }
              else {
                setToast('Error creating workspace!');
                console.log(data)
              } 
            }
        else if (response.status === 400) {
          setError(signupData.msg || "Unknown error.");
          console.log(signupData);
        }
        else {
          setError("Something went wrong. Please try again.");
          console.error(signupData); 
      }
    }catch(err){
      switch (err.message) {
            case "network_error":
              setError("No internet or server is unreachable.");
              break;
            default:
              setError("Unexpected error. Please try again later.");
          }
  }
  }
  
      // handle login=======================================
      const handleLogin = () => {
        navigate('/login');
      }
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
   
           <form onSubmit={handleSignup} className={styles.form}>

              <label htmlFor="username" className={styles.lable}>Username</label><br/>
              <input required type="text" name='username' placeholder='Enter a username' className={styles.inputField}  
                  value={formData.username} onChange={(e) => {
                    const { name, value } = e.target;
                    const capitalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                    setformData({ ...formData, [name]: capitalized });
                  }}
                  /><br/>
           
               <label htmlFor="email" className={styles.lable}>Email</label><br/>
               <input required type="email" name='email' placeholder='Enter your email' className={styles.inputField} 
               value={formData.email} onChange={(e)=>setformData({...formData, [e.target.name]: e.target.value})} /><br/>
   
               <label htmlFor="password" className={styles.lable}>Password</label><br/>
               <input required type="password" name="password"  placeholder='Password' className={styles.inputField}
               value={formData.password} onChange={(e)=>setformData({...formData, [e.target.name]: e.target.value})}/><br />

               <label htmlFor="confirmPassword" className={styles.lable}>Confirm Password</label><br/>
               <input required type="password" name="confirmPassword"  placeholder='Confirm Password' className={styles.inputField}
               value={formData.confirmPassword} onChange={(e)=>setformData({...formData, [e.target.name]: e.target.value})}/><br />
   
               <button type='submit' className={styles.buttons}>Signup</button><br/>
               {error && <p style={{ color: "red" , fontWeight: "300", fontSize:'14px'}}>{error}</p>}
               <div style={{textAlign:'center', fontSize:'13px', marginTop:'5px'}}><span>OR</span></div><br/>
   
               <button type="button" className={styles.buttons}>
                      <div className={styles.gImgBg}>
                      <img src={googleIcon} alt="googleicon" className={styles.gImgFront}/> 
                    </div>
                   Sign in with Google</button><br/>
   
               <div style={{textAlign:'center'}}>
               <p style={{fontSize:'14px'}}>Already have an account? <span style={{color:'#1A5FFF'}} onClick={handleLogin}>Login</span></p>
               </div>
           </form>
           
           <img src={backArrow} alt="go-back" className={styles.backArrowImg}  onClick={()=>navigate(-1)}/>
           <img src={triangle} alt="triangle" className={styles.triangeImg}/>
            <img src={triangleTwo} alt="triangle" className={styles.triangeImgTwo}/>
           <img src={rightSeiCircle} alt="right-semi-circle" className={styles.rightSemiCircle}/>
           <img src={bottomSemiCircle} alt="bottom-semi-circle" className={styles.bottomSemiCircle}/>
       </div>
  )
}

export default Signup
