import React, {useEffect, useState} from 'react'
import styles from './Response.module.css'
import { PieChart } from 'react-minimal-pie-chart';


function Response({workspaceId, formId, fetchedForm, isLight}) {
  const [formStart, setFormStart] = useState(0)
  const [formSubmission, setFormSubmission] = useState(0)
  const [accessCount, setAccessCount] = useState(0)
  const url = import.meta.env.VITE_BACKEND_URL;

  const [submissionsArray, setSubmissionsArray] = useState([])
  const [filteredFormData, setFilteredFormData] = useState([])


     useEffect(() => {
       const fetchFormSubmissions = async () => {
           try {
               const response = await fetch(`${url}/workspace/forms/${workspaceId}/${formId}/submissions`);
               const submissionData = await response.json();
     
           } catch (err) {
               console.log('Error fetching form submissions:', err);
           }

          console.log('fetchedForm:', fetchedForm);
          setFormStart(fetchedForm.formStart);
          setFormSubmission(fetchedForm.formSubmission);
          setAccessCount(fetchedForm.accessCount);
          setSubmissionsArray(fetchedForm.submissions);

          const filteredFormData = Object.values(fetchedForm.formData).filter(
            item => !['text', 'image', 'input-button'].includes(item.type)
          );
          console.log('Filtered Form Data:', submissionsArray);
          setFilteredFormData(filteredFormData);
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
         {/* <PieChart
            data={[
              { title: 'One', value: formSubmission, color: '#3B82F6' },
              { title: 'Two', value: formStart-formSubmission, color: '#909090' },
            ]}
            innerRadius={0.5} 
            radius={50} 
            lineWidth={30}
            style={{ width: '200px', height: '200px' }} /> */}
        <div className={styles.pieChartContainer}>
        <PieChart
  data={[
    { title: 'One', value: formSubmission, color: '#3B82F6' },
    { title: 'Two', value: formStart - formSubmission, color: '#909090' },
  ]}
  innerRadius={0.5}
  radius={50}
  lineWidth={30}
  style={{ 
    width: '200px', 
    height: '200px',
    maxWidth: '100%',
    transform: window.innerWidth < 600 ? 'scale(0.7)' : 'scale(1)',
  }}
/>

            </div>
  
        <div className={styles.completionRate}>
          <p>Completion rate</p>
          <p>{Math.round((formSubmission / formStart) * 100)}%</p>
        </div>
      </div>

      {/* ======== submissions data table======== */}
<div className={styles.tableContainer}>
 <table className={styles.table}>
  <thead>
    <tr>
      <th>📅 Submitted at</th>
      {filteredFormData.map(field => (
        <th key={field._id}>{field.value}</th>
      ))}
    </tr>
  </thead>

  <tbody>
    {submissionsArray.map((submission, index) => (
      <tr key={index}>
        <td>
          {new Date(submission.createdAt).toLocaleString('en-US', {
          month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
          })}
        </td>

        {filteredFormData.map(field => (
          <td key={field._id}>
            {/* {submission[field._id] || ''} */}
               {submission.data?.[field._id] || ''}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
</div>



    </div>
  )
}

export default Response


