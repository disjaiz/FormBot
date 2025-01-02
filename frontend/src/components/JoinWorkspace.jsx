import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinWorkspace = () => {
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(window.location.search);
    const workspaceId = window.location.pathname.split('/')[2]; // Extract workspaceId from URL
    const accessLevel = queryParams.get('accessLevel'); // Get accessLevel from query params
   
    useEffect(() => {
        const checkAndJoinWorkspace = async () => {
            try {
               
                const response = await fetch(`http://localhost:3000/workspace/${workspaceId}/join?accessLevel=${accessLevel}`,
                    {
                        method: 'GET',
                        credentials: 'include', 
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    alert(data.message);
                    navigate('/'); 
                } else {
                    alert(response);
                }
            } catch (error) {
                console.log('An error occurred:', error.message);
                alert('in catch block');
            }
        };

        checkAndJoinWorkspace();
    }, [workspaceId, accessLevel, navigate]);

    return <div>Joining workspace...</div>;
};
export default JoinWorkspace;