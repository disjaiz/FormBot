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

function Signup() {
   const navigate = useNavigate();
   const [formData, setformData] = useState({
    username:"",
    email: "",
    password: "",
    confirmPassword: ""
  })
      // handle signup=======================================
       const handleSignup = async (e) => {
        e.preventDefault()
        
        const response = await signup(formData)
        const signupData = await response.json();

        if (response.status === 200) {
          alert('signed up successfully!');

              // create workspace
              // const Wresponse = await createWorkspace({workspaceName: formData.username, userId: signupData.user._id})
              const Wresponse = await createWorkspace();
              const data = await Wresponse.json();

              if (Wresponse.status === 200) {
                alert('Workspace created successfully!');
                navigate('/userWorkspace',  { state: { username: formData.username }});
              }
              else if (Wresponse.status === 400) {
                alert('Error in input data');
                console.log(data)
              }
              else {
                alert('Error creating workspace!');
                console.error(data); 
              } 
            }
        else if (response.status === 400) {
          alert('Error in input data');
          console.log(signupData)
        }

        else {
          alert('Error adding data!');
          console.error(signupData); 
      }
    }
  
      // handle login=======================================
      const handleLogin = () => {
        navigate('/login');
      }
  return (
   <div className={styles.container}>
   
           <form onSubmit={handleSignup} className={styles.form}>

              <label htmlFor="username" className={styles.lable}>Username</label><br/>
              <input required type="text" name='username' placeholder='Enter a username' className={styles.inputField}  
              value={formData.username} onChange={(e)=>setformData({...formData,[e.target.name]: e.target.value})}/><br/>
           
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
               <div style={{textAlign:'center', fontSize:'13px', marginTop:'5px'}}><span>OR</span></div><br/>
   
               <button type="button" className={styles.buttons}>
                    <img src={googleIconBg} alt="bg" className={styles.gImgBg}/>
                    <img src={googleIcon} alt="googleicon" className={styles.gImgFront}/> 
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
