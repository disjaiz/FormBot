import React, {useState, useEffect} from 'react'
import styles from './UserWorkspace.module.css';
import folderSvg from '../Images/folderSvg.png';
import plusSvg from '../Images/plusSvg.png';
import deleteImg from '../Images/delete.png';
import { useLocation } from 'react-router-dom';
import FolderModal from './FolderModal';
import FolderDeleteModal from './FolderDeleteModal';
import FormDeleteModal from './FormDeleteModal';
import { useNavigate } from 'react-router-dom';
import ShareModal from "./ShareModal";

export default function UserWorkspace() {
  const [workspaceId, setWorkspaceId] = useState(null);
  const [accessLevel, setAccessLevel] = useState(null);
  const navigate = useNavigate();
  const [isLight, setIsLight] = useState(false);
  const location = useLocation();
  const { username } = location.state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [folders, setFolders] = useState([]);
  const [forms, setForms] = useState([]); 
  const [showFormModal, setShowFormModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [formToDelete, setFormToDelete] = useState(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const handleShare = () => setShowShareModal(true);
  const closeModal = () => setShowShareModal(false);

  const [workspaces, setWorkspaces] = useState([]);

  const handleDeleteFolder = async (folderId) => {
    console.log('folderid:',  folderId)
    try {
      const response = await fetch("http://localhost:3000/workspace/deleteFolder", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ folderId }),
      });
      const data = await response.json();
      if (response.status === 200) {
        console.log(data);
        // setFolders(data.folders);
        setFolders(folders.filter((folder) => folder._id!== folderId));
      }
      else if (response.status === 400){
        console.log(data);
      }
      else if (response.status === 500){
        console.log(data);
      }
      else if (response.status === 404){
        console.log(data);
      }
     
      
    } catch (error) {
      console.error('Error deleting folder:', error);
      alert('Failed to delete folder');
    }
  }
  
  const handleDeleteForm = async (formId) => {
    console.log('formid:',  formId)
    try {
      const response = await fetch("http://localhost:3000/workspace/deleteForm", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ formId , workspaceId })
      });
      const data = await response.json();
      if (response.status === 200) {
        console.log(data);
        // setFolders(data.folders);
        setForms(forms.filter((form) => form._id!== formId));
      }
      else if (response.status === 400){
        console.log(data);
      }
      else if (response.status === 500){
        console.log(data);
      }
      else if (response.status === 404){
        console.log(data);
      }   
    } catch (error) {
      console.error('Error deleting form:', error);
      alert('Failed to delete form');
    }
  }
  const handleRemoveFolder = (folderId, folderName) => {
      setShowFolderModal(true);
      setFolderToDelete({ folderId, folderName });
    };
  const handleCloseFolderModal = () => {
      setShowFolderModal(false);
      setFolderToDelete(null);
    };
  const handleConfirmDeleteFolder = async () => {
      if (folderToDelete) {
        await handleDeleteFolder(folderToDelete.folderId); 
        handleCloseFolderModal(); 
      }};

  const handleRemoveForm = (formId, formName) => {
  setShowFormModal(true);
  setFormToDelete({ formId, formName });
}
  const handleCloseFormModal = () => {
      setShowFormModal(false);
      setFormToDelete(null);
    };
  const handleConfirmDeleteForm = async () => {
      if (formToDelete) {
        await handleDeleteForm(formToDelete.formId); 
        handleCloseFormModal(); 
      }};



useEffect(() => {
  const fetchDefaultWorkspace = async () => {
    try {
      const response = await fetch('http://localhost:3000/workspace/find', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setWorkspaces(data.workspaces);
  
        const ownerWorkspace = data.workspaces.find(workspace => workspace.accessLevel === "owner");
       
if (ownerWorkspace) {
    const { workspaceId, accessLevel, forms, folders } = ownerWorkspace;
    setWorkspaceId(workspaceId);
    setAccessLevel(accessLevel);
    setForms(forms || []);
    setFolders(folders || []);
    console.log('workspace:', data.workspaces);
    console.log('default workspace:', workspaceId, accessLevel);
}
       
      } else {
        console.error('Error fetching default workspace:', data.message);
      }
    } catch (error) {
      console.error('Error fetching default workspace:', error);
    }
  };

  fetchDefaultWorkspace();
}, []);


// =================================================================================================================
    // useEffect(() => {
    //   const fetchWorkspaces = async () => {
    //     const response = await fetch('/api/workspaces', { credentials: 'include' });
    //     const data = await response.json();
    //     setOwnedWorkspaces(data.owned);
    //     setSharedWorkspaces(data.shared);
    //   };
    
    //   fetchWorkspaces();
    // }, []);
// =================================================================================================================    

  const handleAddFolder = async (folderName) => {
    try {
      const response = await fetch('http://localhost:3000/workspace/addFolder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ folderName }),
      });

      const data = await response.json();

      if(response.status === 200){
        console.log('folder created',  data);
      }
      else if(response.status === 400){
        console.log(data)
      }
      else if (response.status === 500) {
        console.log( data)
      }
      setFolders([...folders, data.folder]);

    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    }
  };


const handleSelectChange = async (selectedWorkspaceId) => {
  switch (selectedWorkspaceId) {
    case "settings":
      navigate('/settings', { state: { isLight } });
      break;
    case "logout":
      handleLogout();
      break;
    default:
      try {
        // Fetch the details of the selected workspace
        const workspaceResponse = await fetch(`http://localhost:3000/workspace/details/${selectedWorkspaceId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const workspaceData = await workspaceResponse.json();
  
        if (workspaceData.success) {
          const { workspaceID, accessLEVEL, formS, folderS } = workspaceData;
          setWorkspaceId(workspaceID);
          setAccessLevel(accessLEVEL);
          setForms(formS || []);
          setFolders(folderS || []);
          
          console.log('selected workspace:', workspaceID);
          console.log('current id', workspaceId);
        } else {
          console.error('Error fetching workspace details:', workspaceData.message);
        }
      } catch (error) {
        console.error('Error switching workspaces:', error);
      }
      break;
    }
};

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/logout', {
        method: 'POST',
        credentials: 'include', 
      });
  
      const data = await response.json();
      console.log(data)
      if (response.ok) {
       navigate('/');
      } else {
        console.log('Logout failed'); }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const handleCreateTypebot = async () => {
    navigate('/formbot' ,  { state: { workspaceId, accessLevel }});
  };

  const handleOpenForm = async (formID) => {
    navigate('/formbot' ,  { state: { workspaceId, accessLevel , formID }});
  }

  return (
    <div className={styles.container}  style={{backgroundColor: isLight ? 'white': '#121212'}}>
      <nav className={styles.nav} >



<select
value={workspaceId || ''}
  name="dropdown"
  className={styles.dropdownSelect}
  onChange={(e) => handleSelectChange(e.target.value)}
  style={{
    backgroundColor: isLight ? 'white' : '#121212',
    color: isLight ? 'black' : 'white',
    border: isLight ? '1px solid #c7c4c4' : '1px solid rgb(74, 71, 71)',
  }}
>
  <option value="settings">Settings</option>
  <option value="logout">Log out</option>
  
  {/* Dynamically render user's workspaces */}
  {workspaces.map((workspace) => (
    <option key={workspace.workspaceId} value={workspace.workspaceId}>
      {workspace.accessLevel === 'owner'? `${username}'s Workspace` : `${workspace.workspaceName} (Shared - ${workspace.accessLevel})`}
    </option>
  ))}
</select>

      {/*===================== toggler========================================= */}
        <div className={styles.toggler}>
           <span style={{color: isLight ? 'black': 'white', fontWeight:'500'}}>Dark</span>
           <button className={styles.switchStyle}  style={{backgroundColor: isLight ? '#3b82f6' : '#e5e7eb'}} onClick={() => setIsLight(!isLight)}  >
           <div className={styles.circleStyle} style={{ left: isLight ? '33px' : '4px'}} />
           </button>
           <span style={{color: isLight ? 'black': 'white', fontWeight:'500'}}>Light</span>
        </div>

        {/* =====================share btn================================================== */}
        <div className={styles.sharebtn} onClick={handleShare}> Share </div>

        {showShareModal && <ShareModal workspaceId={workspaceId} closeModal={closeModal}  isLight={isLight}/>}

      </nav>

      {/* =====================dashboard body========================================= */}
        <div className={styles.dashboardBody}>
          <div className={styles.dashboardBodyInner}>

          <div className={styles.allFolders}>
          {accessLevel !== 'view' && (
            <button className={styles.createfolderbtn} onClick={() => setIsModalOpen(true)} 
            style={{backgroundColor: isLight ? 'white': '#3b3a3a', color: isLight ? 'black': 'white', border: isLight ? '1px solid #c7c4c4' : 'none'}}>
              <img src={folderSvg} style={{marginRight:'6px'}}/>
              <p style={{fontFamily:'Open Sans'}}>Create a Folder</p>
            </button>
            )}

            {folders.map((folder, index) => (
                <div key={index} className={styles.folderNameDiv} style={{backgroundColor: isLight ? 'white': '#3b3a3a', color: isLight ? 'black': 'white', border: isLight ? '1px solid #c7c4c4' : 'none'}} >
                    <p  style={{fontSize: '15px', marginRight:'8px', }}>{folder.folderName}</p>
                    <img src={deleteImg} alt="deleteImg" onClick={(e) => {e.stopPropagation(); handleRemoveFolder(folder._id, folder.folderName)}}/>
                </div>
              ))}
        </div>  

        <FolderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddFolder}
          isLight={isLight}
        />
     {/* Delete Confirmation Modal */}
      <FolderDeleteModal
        isOpen={showFolderModal}
        onClose={handleCloseFolderModal}
        onConfirm={handleConfirmDeleteFolder}
        isLight={isLight}
      />
{/* =================================form bot=========================================== */}
        <div className={styles.allForms}>
        {accessLevel !== 'view' && (
           <div className={styles.typeBotBtn} onClick={handleCreateTypebot}>
            <img src={plusSvg} style={{height:'30px', width:'30px', marginBottom:'14px'}} />   
            <p style={{fontSize: '14px', fontFamily:'Open Sans'}}>Create a typebot</p>
          </div>
        )}

          {forms.map((form) => (
            <div key={form._id} className={styles.formNameDiv} onClick={()=> handleOpenForm(form._id)}  style={{
              backgroundColor: isLight ? '#f0f0f0' : '#FFFFFF80', 
              color: isLight ? 'black' : 'white'
          }} >
              <p style={{fontSize: '15px', marginRight:'8px', fontFamily:'Open Sans'}}>{form.formName}</p>
              <img src={deleteImg} className={styles.deleteFormbtn}  onClick={(e) => {e.stopPropagation();  handleRemoveForm(form._id, form.formName)}}/>
            </div>
          ))}
</div>
      <FormDeleteModal 
        isOpen={showFormModal}
        onClose={handleCloseFormModal}
        onConfirm={handleConfirmDeleteForm}
        isLight={isLight}
       />
    
     
    </div>
    </div>
    </div>
  )
}

