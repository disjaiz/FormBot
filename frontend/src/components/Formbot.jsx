import React, { useState, useEffect } from 'react' 
import { useNavigate,  useLocation } from 'react-router-dom';
import styles from './Formbot.module.css';
import close from '../Images/close.png';
import rating from  '../Images/rating.png';
import date from '../Images/date.png';
import hash from '../Images/hash.png';
import deleteIcon from '../Images/delete.png';
import msg from '../Images/msg.png';
import t from '../Images/t.png';
import telephone from '../Images/telephone.png';
import atTheRate from '../Images/@.png';
import buttons from '../Images/buttons.png';
import flag from '../Images/flag.png';
import Response from './Response';
import Toast from '../Toast';
import lightModeImg from '../Images/light-mode.png';
import darkModeImg from '../Images/night-mode.png';

function Formbot() {
  const [toast, setToast] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
   const navigate = useNavigate();
   const [formSaved, setFormSaved] = useState(false);
   const [isLight, setIsLight] = useState(false);
   const [mode, setMode] = useState("Flow"); 
   const [formElements, setFormElements] = useState([]); 
   const [formId, setFormId] = useState('');
   const [formName, setFormName] = useState('');
   const { workspaceId, accessLevel , formID} = location.state || { }; 
   const [inputCounts, setInputCounts] = useState({
     text: 0,
     image: 0,
     'input-text': 0,
     'input-number': 0,
     'input-email': 0,
     'input-phone': 0,
     'input-date': 0,
     'input-rating': 0,
     'input-button': 0,
   });
   const [fetchedForm, setFetchedForm] = useState(null);

// =======================================================================
   const fetchForm = async (workspaceId, formID) => {
     try {
       const response = await fetch(`${backendUrl}/workspace/form`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         credentials: 'include',
         body: JSON.stringify({ workspaceId, formID }),
       });
   
       const data = await response.json();
       if (data.success) {
         setFetchedForm(data.form);
         return data.form 
       } else {
         console.error('Error:', data.message);
       }
     } catch (error) {
       console.error('Error fetching form:', error);
     }
   };

 useEffect(() => {
const getForm = async () => {
 if (workspaceId && formID) {
   try {
     const form = await fetchForm(workspaceId, formID);
     
     // Transform the loaded elements to ensure they have proper headers
     const transformedElements = form.formData.map(element => {
       let header;
       let content;
       if (element.type === "text") {
         header = "Text";
         content = 'Edit me';
       } else if (element.type === "image") {
         header = `Image${inputCounts.image + 1}`;
         content = 'Enter image link';
       } else if (element.type.startsWith("input-")) {
         const inputType = element.type.split("-")[1];
         header = `${inputType[0].toUpperCase()}${inputType.slice(1)}${inputCounts[element.type] + 1}`;
       }

       return {
         ...element,
         header: element.header || header ,// Use existing header if present, otherwise generate new
         content: element.content || content // Use existing content if present, otherwise leave it empty
       };
     });

     // Calculate input counts from loaded elements
     const counts = transformedElements.reduce((acc, element) => {
       acc[element.type] = (acc[element.type] || 0) + 1;
       return acc;
     }, {...inputCounts});
     
     setInputCounts(counts);
     setFormElements(transformedElements);
     setFormName(form.formName);
     setFormId(formID);
   } catch (error) {
     console.error('Error loading form:', error);
   }
 }
};

   getForm();
 }, [workspaceId, formID]);

 //===============================================================================================================================================================
const toggleMode = (selectedMode) => {
   setMode(selectedMode);
  //  console.log('Toggle mode', selectedMode)
};


const handleAddElement = (type) => {
 if (type.startsWith("input-") || type === "image") {
   const inputType = type.startsWith("input-") ? type.split("-")[1] : type;
   setInputCounts((prev) => ({
     ...prev,
     [type]: prev[type] + 1,
   }));
 }

 const newElement = {
   id: Date.now(),
   type: type,
   content: type === "text" ? "Edit me" : type === "image" ? "Enter image link" : "",
   header: type === "text"
     ? "Text"
     : type === "image"
       ? `Image${inputCounts.image + 1}`
       : type.startsWith("input-")
         ? `${type.split("-")[1][0].toUpperCase()}${type.split("-")[1].slice(1)}${inputCounts[type] + 1}`
         : "",
 };
 setFormElements((prev) => [...prev, newElement]);
};

// Update element content
const handleUpdateElement = (id, newContent) => {
 setFormElements((prev) =>
   prev.map((element) => {
     if (element.id === id || element._id === id) {  // Handle both new and loaded elements
       return {
         ...element,
         content: newContent,
        //  header: element.type === "image" ? element.header : newContent || element.header,
        header: element.header,
       };
     }
     return element;
   })
 );
};
// Delete element
const handleDeleteElement = (id) => {
 const elementToDelete = formElements.find(el => el.id === id || el._id === id);
 setFormElements((prev) => prev.filter((el) => el.id !== id && el._id !== id));
 
 // Update input counts
 if (elementToDelete) {
   setInputCounts(prev => ({
     ...prev,
     [elementToDelete.type]: prev[elementToDelete.type] - 1
   }));
 }
};

// Render form element
const renderElement = (element) => {
 const elementId = element.id || element._id; // Handle both new and loaded elements
 
 return (
   <div className={styles.card} style={{ position: "relative" , backgroundColor: isLight ?'white': '#18181B',border: isLight ? '1px solid #c7c4c4' : 'none'}}>
     {/* Delete Button */}
     <button
       onClick={() => handleDeleteElement(elementId)}
       className={styles.cardDeleteButton}
       style={{
         height: '27px',
         width: "27px",
         borderRadius: '50%',
         backgroundColor: isLight ?'white': '#444444',
         border: isLight ? '1px solid #c7c4c4' : '1px solid rgb(74, 71, 71)',
       }}>
       <img src={deleteIcon} style={{ width: "15px", height: "15px" }} />
     </button>

     {/* Card Content */}
     
     {element.type === "text" && (
       <>
         <p className={styles.cardHeader} style={{color: isLight? 'black':'white'}}>{element.header}</p>
         <input
           type="text"
           value={element.content}
           onChange={(e) => handleUpdateElement(elementId, e.target.value)}
           className={styles.cardInput}
           style={{ backgroundColor: isLight ?'white': '#1F1F23', color: isLight? 'rgb(85, 85, 85)': 'white', border: isLight ? '1px solid #c7c4c4' : 'none'}}
         />
       </>
     )}
     {element.type === "image" && (
       <>
         <p className={styles.cardHeader} style={{color: isLight? 'black':'white'}}>{element.header}</p>
         <input
           type="text"
           placeholder="Enter image URL"
           value={element.content}
           onChange={(e) => handleUpdateElement(elementId, e.target.value)}
           className={styles.cardInput}
           style={{ backgroundColor: isLight ?'white': '#1F1F23' , color: isLight? 'rgb(85, 85, 85)': 'white', border: isLight ? '1px solid #c7c4c4' : 'none'}}
         />
       </>
     )}
     {element.type.startsWith("input-") && (
       <>
         <p className={styles.cardHeader} style={{color: isLight? 'black':'white'}}>{element.header}</p>
         <input
           type="text"
           placeholder={`Enter your ${element.header}`}
           disabled
           className={styles.cardInput}
           style={{ backgroundColor: isLight ?'white': '#1F1F23',border: isLight ? '1px solid #c7c4c4' : 'none'}}
         />
       </>
     )}
   </div>
 );
};

// Save form
const handleSaveForm = async () => {
 console.log(accessLevel);
 if (accessLevel !== 'edit' && accessLevel !== 'owner') {
   setToast("You do not have permission to save this form.");
   return;
  }
   if (!workspaceId) {
     setToast({message:"Workspace ID not found!", bg:"red"});
     return;
   }

   if (!formName || formElements.length === 0 || !formElements.some(el => el.type.startsWith("input-") && el.type.startsWith('input-button'))) {
     setToast({message:"Please provide a form name, a button and at least one input element ", bg:"red"});
     return;
   }
   console.log('Saving form with elements:', formElements);

 const formData = formElements.map((el) => ({
         type: el.type,  // This can now include 'input-phone', 'input-email', etc.
        //  value: el.content || '',  
         value:el.type.startsWith("input-") ? el.header : el.content || '',
         inputType: el.type.startsWith("input-") ? el.type.split("-")[1] : null,
       }));
       console.log('formdata', formData);
 try {
   // If formId exists, update existing form, otherwise create new
   const endpoint = formId 
     ? `${backendUrl}/workspace/updateForm/${formId}`
     :  `${backendUrl}/workspace/saveForm`;

   const method = formId ? 'PUT' : 'POST';
   
   const response = await fetch(endpoint, {
     method,
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       workspaceId,
       formName,
       formData
     }),
     credentials: 'include',
   });

   if (!response.ok) {
     console.log('Failed to save form')
   };
   
   // Handle successful save
   const savedForm = await response.json();
     setFormId(savedForm.formId);
     setFormSaved(true);
   console.log(savedForm.formId);
   console.log(formId);
   setToast({ message:'Form saved!', bg:'green' });

 } catch (error) {
   console.error('Error saving form:', error.message);
  setToast({ message:'Error saving form. Please try again.', bg:'red' });
 }
};

const handleShareForm = () => {
 // console.log(formId)
 if (formId) {
   const shareLink = `${window.location.origin}/forms/${workspaceId}/${formId}`;
  //  alert(`Share this link: ${shareLink}`);
  //  setToast({ message: 'Link copied to clipboard!', bg: 'green' });
   // Copy the link to clipboard
   navigator.clipboard.writeText(shareLink).then(() => {
    setToast({ message: 'Link copied to clipboard!', bg: 'green' });
   }).catch(err => {
     console.error('Failed to copy the link: ', err);
   });
 }  
};


 return (
  <div className={styles.container}  style={{backgroundColor: isLight ? 'white': '#121212'}} >
     {toast && (
            <Toast
              message={toast.message}
              duration={30000}
              onClose={() => setToast(null)}
              bgColor={toast.bg}
            />
          )}

      <nav className={styles.nav} style={{backgroundColor: isLight ? 'white': '#121212'}}>
        {/* ================input form name======== -=======================================*/}
          {mode === 'Flow' && (
             <input type="text" 
                    maxLength={25}
                    id="name" 
                    name="name"  
                    className={styles.formNameInput} 
                    placeholder='Enter Form Name' 
                    required   value={formName}
                    onChange={(e) => setFormName(e.target.value)} 
                    style={{backgroundColor: isLight ? 'white': '#121212' , color: isLight? 'black': 'white', border: isLight ? '1px solid #c7c4c4' : '1px solid rgb(74, 71, 71)'}}
                    />
           )}
            {/* =======================FLOW and RES modes======================================= */} 
           <div className={styles.modes} style={{backgroundColor: isLight ? 'white': '#121212'}} >
            <button
             className={`${styles.flowResbtn} ${mode === "Flow" ? styles.active : ""}`}
                onClick={() => toggleMode("Flow")}
                 style={{backgroundColor: isLight ? 'white': '#121212', color: isLight ? (mode === "Flow" ? '#2769f6' : 'black') : 'white',}} >
            Flow
           </button>
            <button
                className={`${styles.flowResbtn} ${mode === "Response" ? styles.active : ""}`}
                onClick={() => toggleMode("Response")} 
                 style={{backgroundColor: isLight ? 'white': '#121212', color: isLight ? (mode === "Response" ? '#2769f6' : 'black') : 'white',}} >
             Response
            </button>
            </div>

         {/* toggler==================toggle theme======================= */}
            <div className={styles.toggler}>
                <span style={{color: isLight ? 'black': 'white', fontWeight:'500'}}>Dark</span>
                <button className={styles.switchStyle}  style={{backgroundColor: isLight ? '#3b82f6' : '#e5e7eb'}} onClick={() => setIsLight(!isLight)}  >
                <div className={styles.circleStyle} style={{ left: isLight ? '33px' : '4px'}} />
                </button>
                <span style={{color: isLight ? 'black': 'white', fontWeight:'500'}}>Light</span>
             </div>

              {/* Mobile toggle */}
                    <div className={styles.mobileToggle} onClick={() => setIsLight(!isLight)}>
                      <img
                        src={isLight ? darkModeImg : lightModeImg}
                        alt="theme toggle"
                        className={styles.toggleImage}
                      />
                    </div>

           {/*================================ share and save btn================================================== */}
           <div style={{display: 'flex', alignItems: 'center', gap: '10px', order: '2'}}>
               <div className={styles.sharebtn} onClick={handleShareForm}  disabled={!formSaved}> Share </div>
              <div className={styles.savebtn} onClick={handleSaveForm}> Save </div>
              <img src={close} alt="cross Img" className={styles.closeImg} onClick={()=> navigate(-1)}/>
            </div>
      </nav>

   {/* =====================dashboard body========================================= */}

   {mode === 'Flow' ? (
    <div className={styles.body} style={{backgroundColor: isLight ? 'white': '#1F1F23'}}>
      <div className={styles.sidebar} style={{backgroundColor: isLight ? 'white': '#121212' , border: isLight ? '1px solid #c7c4c4' : '1px solid rgb(74, 71, 71)'}}>
        <div className={styles.boxHeaderDiv} style={{color: isLight ? 'black': 'white'}} >Bubbles</div>
          <div className={styles.bubblesBox}>
         <div className={styles.inputBtns} onClick={() => handleAddElement("text")} 
         style={{backgroundColor: isLight ? 'white': '#1F1F23', color: isLight ? 'black': 'white',  border: isLight ? '1px solid #c7c4c4' : '1px solid rgb(74, 71, 71)'}}>
         <img src={msg} style={{ marginRight: '6px' }} alt="Text" />
           Text </div>

         <div className={styles.inputBtns} onClick={() => handleAddElement("image")}  
         style={{backgroundColor: isLight ? 'white': '#1F1F23', color: isLight ? 'black': 'white',  border: isLight ? '1px solid #c7c4c4' : '1px solid rgb(74, 71, 71)'}}>
         <img src={msg} style={{ marginRight: '6px' }} alt="Text" />
           Image</div>
          </div>

        <div className={styles.boxHeaderDiv} style={{color: isLight ? 'black': 'white'}}>Inputs </div>
          <div className={styles.inputsBox}>

          <div className={styles.inputBtns} onClick={() => handleAddElement('input-text')} 
          style={{backgroundColor: isLight ? 'white': '#1F1F23', color: isLight ? 'black': 'white',  border: isLight ? '1px solid #c7c4c4' : '1px solid rgb(74, 71, 71)'}}>
          <img src={t} style={{ marginRight: '6px' }} alt="Text Input" />
           Text
          </div>
         <div className={styles.inputBtns} onClick={() => handleAddElement("input-number")}
            style={{backgroundColor: isLight ? 'white': '#1F1F23', color: isLight ? 'black': 'white',  border: isLight ? '1px solid #c7c4c4' : '1px solid rgb(74, 71, 71)'}}> 
         <img src={hash} style={{ marginRight: '6px' }} alt="Number Input" />
           Number</div>
         <div className={styles.inputBtns} onClick={() => handleAddElement("input-email")}
            style={{backgroundColor: isLight ? 'white': '#1F1F23', color: isLight ? 'black': 'white',  border: isLight ? '1px solid #c7c4c4' : '1px solid rgb(74, 71, 71)'}}>
         <img 
       src={atTheRate}
       style={{ marginRight: '6px' }}
       alt="Email Input"
     />
           Email
         </div>
         <div className={styles.inputBtns} onClick={() => handleAddElement("input-phone")}
            style={{backgroundColor: isLight ? 'white': '#1F1F23', color: isLight ? 'black': 'white',  border: isLight ? '1px solid #c7c4c4' : '1px solid rgb(74, 71, 71)'}}>
         <img 
       src={telephone}
       style={{ marginRight: '6px' }}
       alt="Phone Input"
     />
           Phone
         </div>
         <div className={styles.inputBtns} onClick={() => handleAddElement("input-date")} 
            style={{backgroundColor: isLight ? 'white': '#1F1F23', color: isLight ? 'black': 'white',  border: isLight ? '1px solid #c7c4c4' : '1px solid rgb(74, 71, 71)'}}>
         <img src={date} style={{ marginRight: '6px' }} alt="Date Input" />
           Date
         </div>
         <div className={styles.inputBtns} onClick={() => handleAddElement("input-rating")}
            style={{backgroundColor: isLight ? 'white': '#1F1F23', color: isLight ? 'black': 'white',  border: isLight ? '1px solid #c7c4c4' : '1px solid rgb(74, 71, 71)'}}>
         <img src={rating} style={{ marginRight: '6px' }} alt="Rating Input" />
           Rating
         </div>
         <div className={styles.inputBtns} onClick={() => handleAddElement("input-button")}
            style={{backgroundColor: isLight ? 'white': '#1F1F23', color: isLight ? 'black': 'white',  border: isLight ? '1px solid #c7c4c4' : '1px solid rgb(74, 71, 71)'}}>
         <img src={buttons} style={{ marginRight: '6px' }} alt="Button" />
           Button
         </div>
          </div>
     </div>

   <div className={styles.mainContent} >
        <div className={styles.flag} style={{color: isLight ? 'black': 'white', backgroundColor: isLight ? 'white': '#121212', border: isLight ? '1px solid #c7c4c4' : 'none'}}>
           <img src={flag} style={{marginRight:'10px', height:'15px'}} />Start
        </div>
          {formElements.map((element) => (<div key={element.id|| element._id}>{renderElement(element)}</div> ))}
   </div>

   </div> ): ( <Response workspaceId={workspaceId} formId={formId} fetchedForm={fetchedForm} isLight={isLight}/>)}


  </div>
)}
export default Formbot;



