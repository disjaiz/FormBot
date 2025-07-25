import React, { useState, useEffect } from "react";
import styles from './EndUserForm.module.css';
import { useParams } from "react-router-dom";
import send from '../Images/send.png';

import Toast from '../Toast';

const EndUserForm = () => {
    const [toast, setToast] = useState(null);
    const {workspaceId, formId } = useParams();
    const [formElements, setFormElements] = useState([]);
    const [inputValues, setInputValues] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [firstInputSubmitted, setFirstInputSubmitted] = useState(false);
    const [firstInputSubmissions, setFirstInputSubmissions] = useState(0);

    const [finalFormSubmissions, setFinalFormSubmissions] = useState(0);
    const [submittedInputs, setSubmittedInputs] = useState(new Set());
    const url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const visitedKey = `visited-form-${formId}`;
        const shouldIncrement = !localStorage.getItem(visitedKey);

        if (shouldIncrement) {
            localStorage.setItem(visitedKey, 'true');
            fetch(`/workspace/track-form-access/${workspaceId}/${formId}`, { method: 'POST' })
                .then(() => console.log('Access count incremented'))
                .catch(err => console.error('Error incrementing access count:', err));
        }

        const trackFormLinkAccess = async () => {
            try {
                const response = await fetch(`${url}/workspace/track-form-access/${workspaceId}/${formId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ shouldIncrement }),
                    credentials: 'include', 
                });
                if (response.status !== 200) {
                    console.error('Failed to track form link access');
                }
            } catch (err) {
                console.error('Error tracking form link access:', err);
            }
        };
        trackFormLinkAccess();

        const fetchForm = async () => {
            try {
                const response = await fetch(`${url}/workspace/forms/${workspaceId}/${formId}`);
                if (response.status === 404) {
                    setFormElements([]);
                    return;
                }
                const data = await response.json();
                setFormElements(data.form.formData);

                // console.log(data);

            } catch (err) {
                console.error("Failed to fetch form:", err);
            }
        };
        fetchForm();
    }, [formId, workspaceId]);

    // Handle change in input values
    const handleInputChange = (id, value) => {
        setInputValues(prevState => ({
            ...prevState,
            [id]: value,
        }));
    };

    // Handle individual input submission
    const handleInputSubmit = async(id, type) => {
        
        const value = inputValues[id];

         // Email Validation
         if (type === 'input-email' && !/^\S+@\S+\.\S+$/.test(value)) {
            alert('Invalid email address');
            return;
        }

        // Phone Validation
        if (type === 'input-phone' && !/^\d{10}$/.test(value)) {
            alert('Invalid phone number');
            return;
        }

         // Ensure submission tracking
         setSubmittedInputs(prev => new Set(prev).add(id));

        console.log(`Input ${id} submitted with value: ${inputValues[id]}`);
    
        if (!firstInputSubmitted) {
            setFirstInputSubmitted(true); // Set the flag to true
            setFirstInputSubmissions(prev => prev + 1); // Increment only once

            try {
                await fetch(`${url}/workspace/track-form-event/${workspaceId}/${formId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'start' }),
                    credentials: 'include', 
                });
            } catch (err) {
                console.error('Error tracking first input submission:', err);
            }
        }
    };
    

    // Handle final form submission
    const handleFinalSubmit = async () => {

        setToast({message:"Form submitted successfully!", bg:"green"});
        // alert('Form submitted successfully');

        setFormSubmitted(true);
        setFinalFormSubmissions(prev => prev + 1); // Increment form submission count

        try {
            await fetch(`${url}/workspace/track-form-event/${workspaceId}/${formId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'final' }),
                credentials: 'include', 
            });
        } catch (err) {
            console.error('Error tracking final form submission:', err);
        }


        try {
            const response = await fetch(`${url}/workspace/forms/${workspaceId}/${formId}/submit`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ inputValues }),
                    credentials: 'include', 
                }
            );
    
            if (response.ok) {
                console.log('Form submission saved');
            } else {
                console.error('Failed to save form submission');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
        }


        // console.log('Form Submitted:', inputValues);
    };


    const allInputsSubmitted = formElements
    .filter(element => element.type.startsWith('input-') && element.type !== 'input-button')
    .every(element => submittedInputs.has(element._id));
   

// ============================================================================================================================================
    return (
        <div className={styles.container}>
              {toast && (
                        <Toast
                          message={toast.message}
                          duration={30000}
                          onClose={() => setToast(null)}
                          bgColor={toast.bg}
                        />
                      )}
          
            <form className={styles.formContainer}>
                {formElements.map((element) => {
                    if (element.type === 'text' || element.type === 'image') {
                        return (
                            <div key={element._id} className={styles.bubble}>

                                {element.type === 'text' && <p className={styles.bubbleText}>{element.value}</p>}
                                {element.type === 'image' && <img src={element.value} alt="Form image" className={styles.bubbleImage}/>}

                            </div>
                        );
                    }

                    if (element.type.startsWith('input-') && element.type !== 'input-button') {
                        return (
                            <div key={element._id} className={styles.inputContainer}>

                                {!element.type.startsWith('input-rating') && 
                                    <input
                                        type={element.inputType}
                                        maxLength={element.inputType === 'phone' ? 10 : undefined}
                                        value={inputValues[element._id] || ''}
                                        onChange={(e) => handleInputChange(element._id, e.target.value)}
                                        placeholder={element.inputType}
                                        className={styles.input}
                                    /> 
                                } 
                                 {element.type === 'input-rating' && (
                                  <div style={{ display:'block'}}  className={styles.input}>

                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span
                                            key={star}
                                            onClick={() => handleInputChange(element._id, star)}
                                            style={{
                                                cursor: 'pointer',
                                                color: inputValues[element._id] >= star ? 'gold' : 'gray',
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            )}
                                <div

                                    type="button"
                                    // onClick={() => handleInputSubmit(element._id, element.type)}
                                    onClick={() => {
                                        const value = inputValues[element._id];
                                        const isRating = element.type === 'input-rating';

                                        const isEmpty = isRating
                                          ? !(value >= 1 && value <= 5)
                                          : !value || value.trim() === '';

                                        if (isEmpty) return;
                                          handleInputSubmit(element._id, element.type);
                                        }}
                                    className={styles.sendButton}
                                    style={{backgroundColor:submittedInputs.has(element._id) ? 'black' : '#2563eb',
                                     cursor: (() => {
                                              const value = inputValues[element._id];
                                              const isRating = element.type === 'input-rating';
                                              const isEmpty = isRating
                                                ? !(value >= 1 && value <= 5)
                                                : !value || value.trim() === '';
                                              return isEmpty ? 'not-allowed' : 'pointer';
                                            })(),
                                    }}
                                >
                                    <img src={send} 
                                    alt="arrow" 
                                    style={{
                                        backgroundColor:submittedInputs.has(element._id) ? 'black' : '#2563eb', 
                                        height:'25px', 
                                        width:"25px", 
                                        borderRadius:'3px'}}/>

                                </div>
                            </div>
                        );
                    }

                    return null;
                })}
                {/* Final Submit Button (input-button) */}
                {formElements.map((element) => {
                    if (element.type === 'input-button') {
                        return (
                            <div key={element._id} className={styles.finalSubmitDiv}>

                                   {/* {allInputsSubmitted && ( */}

                                <button
                                    type="button"
                                    onClick={handleFinalSubmit}
                                    className={styles.finalSubmitButton}

                                    disabled={!allInputsSubmitted}
                                >
                                    Submit Form
                                </button>
                                 {/* )} */}

                            </div>
                        );
                    }
                    return null;
                })}
            </form>
           
        </div>
    );
};

export default EndUserForm;
// =============================================================================================================================================

