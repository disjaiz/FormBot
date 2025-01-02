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

// function Login() {
//   const navigate = useNavigate();
//   const [formData, setformData] = useState({
//     email: "",
//     password: "",
//   })
//     // handle login=======================================
//     const handleLogin = async (e) => {
//       e.preventDefault()
      
//       const response = await login(formData);
//       const logindata = await response.json();

//         if (response.status === 200) {
          
//           console.log('login successfully:');


//               // find workspace
//               const Wresponse = await findWorkspace();
//               const workspaceData = await Wresponse.json();

//               if (Wresponse.status === 200) {
//                 console.log( workspaceData.workspace.workspaceName);        
//                 navigate('/userWorkspace',  { state: { username: workspaceData.workspace.workspaceName }});
//               }
//               else if (Wresponse.status === 400) {
//                 alert('Error in input data');
//                 console.log(workspaceData)
//               }
//               else {
//                 alert('Error finding workspace!');  
//                 console.error(workspaceData);
//               }

//         } 
//         else if (response.status === 400) {
//           alert(logindata.msg);
//           console.log(logindata)
//         }

//         else {
//           alert('Error adding data!');
//           console.error(logindata); 
//       }
//     }
//     // handle register=======================================
//     const handleRegister = () => {
//       navigate('/signup');
//     }

//   return (
//     <div className={styles.container}>

//         <form onSubmit={handleLogin} className={styles.form}>
//             <label htmlFor="email" className={styles.lable}>Email</label><br/>
//             <input required type="email" name='email' placeholder='Enter your email' className={styles.inputField}
//             value={formData.email} onChange={(e)=>setformData({...formData,[e.target.name]: e.target.value})}/><br/>

//             <label htmlFor="password" className={styles.lable}>Password</label><br/>
//             <input required type="password" name="password" id="pass" placeholder='Password' className={styles.inputField}
//             value={formData.password} onChange={(e)=>setformData({...formData,[e.target.name]: e.target.value})}/><br />

//             <button type='submit' className={styles.buttons}>Log in</button><br/>
//             <div style={{textAlign:'center', fontSize:'13px', marginTop:'5px'}}><span>OR</span></div><br/>

//             <button type="button" className={styles.buttons}>
//                  <img src={googleIconBg} alt="bg" className={styles.gImgBg}/>
//                  <img src={googleIcon} alt="googleicon" className={styles.gImgFront}/> 
//                 Sign in with Google</button><br/>

//             <div style={{textAlign:'center'}}>
//             <p style={{fontSize:'14px'}}>Don't have an account? <span style={{color:'#1A5FFF'}} onClick={handleRegister}>Register now</span></p>
//             </div>
//         </form>
        
//         <img src={backArrow} alt="go-back" className={styles.backArrowImg}  onClick={()=>navigate(-1)}/>
//         <img src={triangle} alt="triangle" className={styles.triangeImg}/>
//         <img src={triangleTwo} alt="triangle" className={styles.triangeImgTwo}/>
//         <img src={rightSeiCircle} alt="right-semi-circle" className={styles.rightSemiCircle}/>
//         <img src={bottomSemiCircle} alt="bottom-semi-circle" className={styles.bottomSemiCircle}/>
//     </div>
//   )
// }



// =============================================================================================================================================

import Cookies from 'js-cookie';
function Login() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  // handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await login(formData);
    const logindata = await response.json();

    if (response.status === 200) {
      console.log('login successfully:');

      // Find workspace 
      const Wresponse = await findWorkspace();
      const workspaceData = await Wresponse.json();

      if (Wresponse.status === 200) {
        console.log(workspaceData.workspace.workspaceName);

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
        alert('Error finding workspace!');
        console.error(workspaceData);
      }
    } else if (response.status === 400) {
      alert(logindata.msg);
      console.log(logindata);
    } else {
      alert('Error adding data!');
      console.error(logindata);
    }
  };

  // handle register
  const handleRegister = () => {
    navigate('/signup');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.form}>
        <label htmlFor="email" className={styles.lable}>Email</label><br/>
        <input required type="email" name='email' placeholder='Enter your email' className={styles.inputField}
          value={formData.email} onChange={(e) => setformData({ ...formData, [e.target.name]: e.target.value })}/><br/>

        <label htmlFor="password" className={styles.lable}>Password</label><br/>
        <input required type="password" name="password" id="pass" placeholder='Password' className={styles.inputField}
          value={formData.password} onChange={(e) => setformData({ ...formData, [e.target.name]: e.target.value })}/><br />

        <button type='submit' className={styles.buttons}>Log in</button><br/>
        <div style={{ textAlign: 'center', fontSize: '13px', marginTop: '5px' }}><span>OR</span></div><br/>

        <button type="button" className={styles.buttons}>
          <img src={googleIconBg} alt="bg" className={styles.gImgBg}/>
          <img src={googleIcon} alt="googleicon" className={styles.gImgFront}/> 
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
