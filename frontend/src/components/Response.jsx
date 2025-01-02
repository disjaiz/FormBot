import React, {useEffect, useState} from 'react'
import styles from './Response.module.css'
import { PieChart } from 'react-minimal-pie-chart';


function Response({workspaceId, formId, fetchedForm, isLight}) {
  const [formStart, setFormStart] = useState(0)
  const [formSubmission, setFormSubmission] = useState(0)
  const [accessCount, setAccessCount] = useState(0)
  const url = "https://formbot-backend-vlhw.onrender.com";

  const [submissionsArray, setSubmissionsArray] = useState([])

     useEffect(() => {
       const fetchFormSubmissions = async () => {
           try {
               const response = await fetch(`${url}/workspace/forms/${workspaceId}/${formId}/submissions`);
               const submissionData = await response.json();
   
               console.log('Form Submissions:', submissionData);
     
           } catch (err) {
               console.log('Error fetching form submissions:', err);
           }

           console.log(fetchedForm);
           setFormStart(fetchedForm.formStart);
           setFormSubmission(fetchedForm.formSubmission);
          setAccessCount(fetchedForm.accessCount);
          setSubmissionsArray(fetchedForm.submissions);
          console.log(fetchedForm.submissions);  
  
       };
       fetchFormSubmissions();
   }, [workspaceId, formId]);


  return (
    <div   className={styles.container} style={{color: isLight ? 'black': 'white', fontWeight:'500'}} >
       {/* =====counts ============== */}
      <div className={styles.countsDiv}> 
        <div className={styles.counts}> 
          <p>Views</p>
          <p> {accessCount}</p>
        </div>
        <div className={styles.counts}>
          <p>Starts</p>
        <p> {formStart}</p></div>
      </div>

{/* ========= pie chart ============= */}
      <div className={styles.completionDiv}> 
      <PieChart
  data={[
    { title: 'One', value: formSubmission, color: '#3B82F6' },
    { title: 'Two', value: formStart, color: '#909090' },
  ]}
  innerRadius={0.5} 
  radius={50} 
  lineWidth={30}
  style={{ width: '200px', height: '200px' }} />

      <div className={styles.completionRate}>
        <p>Completion rate</p>
        <p>{formSubmission/formStart}%</p>
      </div>
      </div>
      
    </div>
  )
}

export default Response


