const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Workspace = require('../Schema/WorkspaceSchema.js');
const User = require('../Schema/UserSchema.js');
const authorizeUserWorkspace = require("../middlewares/Authorization.js");
const authenticate = require("../middlewares/Authentication.js");
const authPublicWorkspace = require("../middlewares/AuthPublicWorkspace.js");

// =================================get all workspaces==============================================================
router.get('/' , async(req, res)=>{
    const workspaces = await Workspace.find();
    try{
        res.json({WorkspaceList: workspaces});
    }
    catch(err){
        res.send(err);
    }
})
// ========================delete all workspaces==============================================================
router.delete('/deleteAll', async(req, res)=>{
    try{
        await Workspace.deleteMany();
        res.json({msg: "All workspaces deleted."});
    }
    catch(err){
        res.send(err);
    }
})
// ============================delete all forms ========================= ================= =========================
router.delete('/deleteAllForms', async(req, res)=>{
  try{
      await Workspace.updateMany(
        { $unset: { "forms": "" } }
      )
      res.json({msg: "All forms deleted."});
  }
  catch(err){
      res.send(err.message);
  }
})

// =====================================get all forms ============================================================================
router.post('/getForms', authenticate, authPublicWorkspace, async (req, res) => { 
  const workspace = req.workspace;

  try {
    // const workspace = await Workspace.findOne({ userId });
    // if (!workspace) {
    //   return res.status(404).json({ message: "Workspace not found" });
    // }
    // Return the forms associated with the workspace
    res.status(200).json({ forms: workspace.forms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// =====================================add folder to workspace================================================
router.post('/addFolder',authenticate, authorizeUserWorkspace,  async (req, res) => {
    try {
      const { folderName } = req.body;
      const userId = req.userId; 
      const workspace = req.workspace;
  
      // Add the folder
      workspace.folders.push({ folderName });
      await workspace.save();

      const createdFolder = workspace.folders[workspace.folders.length - 1];
  
      res.status(200).json({ message: 'Folder created', folder: createdFolder});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

//   =================================get all folders ==================================================
  router.post('/getFolders',authenticate, authPublicWorkspace, async (req, res) => {
    try {
      const workspace = req.workspace;
    
      res.status(200).json({ folders: workspace.folders });
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// //==================================delete a folder ======================================================
//   router.delete('/deleteFolder', authorizeWorkspace, async (req, res) => {
//     try {
//       const { folderId } = req.body;
//       const userId = req.userId;
  
//       const workspace = await Workspace.findOne({ userId });
//     //   console.log('workspace',workspace)
//       if (!workspace) return res.status(400).json({ message: 'Workspace not found' });
  
//       // Remove the folder
//       workspace.folders = workspace.folders.filter((folder) => folder._id.toString()!== folderId);
//       await workspace.save();
  
//       res.status(200).json({ message: 'Folder deleted' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });

router.delete('/deleteFolder', authenticate,  authorizeUserWorkspace ,async (req, res) => {
    try {
      const { folderId } = req.body;
      const workspace = req.workspace;
  
      if (!folderId) {
        return res.status(400).json({ message: 'Folder ID is required' });
      }
     
      const folderExists = workspace.folders.some(
        (folder) => folder._id.toString() === folderId
      );
      if (!folderExists) {
        return res.status(404).json({ message: 'Folder not found' });
      }
      
      workspace.folders = workspace.folders.filter(
        (folder) => folder._id.toString() !== folderId
      );
      await workspace.save();
  
      res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.delete('/deleteForm', authenticate,  authPublicWorkspace ,async (req, res) => {
    try {
      const { formId } = req.body;
      const workspace = req.workspace;
  
      if (!formId) {
        return res.status(400).json({ message: 'Form ID is required' });
      }
    
      const formExists = workspace.forms.some(
        (form) => form._id.toString() === formId
      );
      if (!formExists) {
        return res.status(404).json({ message: 'Form not found' });
      }
   
      workspace.forms = workspace.forms.filter(
        (form) => form._id.toString() !== formId
      );
      await workspace.save();
  
      res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// ========================================================fetch form by form id===================================================================================
  // router.get('/form/:formId', authenticate, async (req, res) => {
  //   const { formId } = req.params;
  
  //   try {
  //     const workspace = await Workspace.findOne({ "forms._id": formId }, { "forms.$": 1 }); // Find the workspace containing the form
  //     if (!workspace) {
  //       return res.status(404).json({ success: false, message: "Form not found." });
  //     }
  
  //     const form = workspace.forms[0]; // Extract the form
  //     res.status(200).json({ success: true, form });
  //   } catch (error) {
  //     console.error("Error fetching form:", error);
  //     res.status(500).json({ success: false, message: "Server error." });
  //   }
  // });
router.post('/form', authenticate, authPublicWorkspace, async (req, res) => {
    const { formID } = req.body; 
    try {
     
      const form = req.workspace.forms.id(formID); 

      if (!form) {
        return res.status(404).json({ success: false, message: 'Form not found.' });
      }
  
      res.status(200).json({ success: true, form });
    } catch (error) {
      console.error('Error fetching form:', error);
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  });
  
// ============================== save form in workspace endpoint ==================================================

router.post('/saveForm', authenticate,authPublicWorkspace, async (req, res) => {
  const { workspaceId, formName, formData } = req.body;
  const workspace = req.workspace;

  if (!workspaceId || !formName || !formData || Object.keys(formData).length === 0) {
    return res.status(400).json({ success: false, message: "Invalid data." });
  }
  try {
    const newForm = {
      formName,
      formData
    };

    workspace.forms.push(newForm);
    await workspace.save();

    const savedForm = workspace.forms[workspace.forms.length - 1]; 

    res.json({ success: true, formId: savedForm._id });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success: false, message: error.message || "Server error." });
  }
});
router.put('/updateForm/:formId', authenticate, authPublicWorkspace, async (req, res) => {
  const { workspaceId, formName, formData } = req.body;
  const { formId } = req.params;
  const workspace = req.workspace;

  
  if (!workspaceId || !formName || !formData || Object.keys(formData).length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid data. Please provide workspaceId, formName, and formData." 
    });
  }

  try {
    
    const formIndex = workspace.forms.findIndex(
      form => form._id.toString() === formId
    );

    if (formIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: "Form not found in workspace." 
      });
    }

    workspace.forms[formIndex] = {
      ...workspace.forms[formIndex].toObject(), 
      formName,
      formData,
      updatedAt: Date.now() 
    };

    
    await workspace.save();

    
    res.json({ 
      success: true, 
      formId,
      message: "Form updated successfully",
      form: workspace.forms[formIndex]
    });

  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error while updating form." 
    });
  }
});

// ==================================================find end user form================================================
router.get("/forms/:workspaceId/:formId", async (req, res) => {
  const { formId } = req.params;
  try {
    const form = await Workspace.findOne({ "forms._id": formId });
    if (form) {
      const selectedForm = form.forms.id(formId);
      res.status(200).json({ success: true, form: selectedForm });
    } else {
      res.status(404).json({ success: false, message: "Form not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================================================================================================================================
// Invite by email
router.post('/:workspaceId/invite', async (req, res) => {
  const { workspaceId } = req.params; // Sender's workspace ID
  const { email, accessLevel } = req.body;

  try {
    
      if (!['view', 'edit'].includes(accessLevel)) {
          return res.status(400).json({ message: 'Invalid access level' });
      }

     
      const senderWorkspace = await Workspace.findById(workspaceId);
      if (!senderWorkspace) {
          return res.status(404).json({ message: 'Sender\'s workspace not found' });
      }

      
      const invitedUser = await User.findOne({ email });
      if (!invitedUser) {
          return res.status(404).json({ message: 'User with the specified email not found' });
      }

      
      const invitedUserWorkspace = await Workspace.findOne({ userId: invitedUser._id });
      if (!invitedUserWorkspace) {
          return res.status(404).json({ message: 'Invited user does not have a workspace' });
      }

      
      const alreadyHasAccess = invitedUserWorkspace.permissions.some(
          (perm) => perm.userId.toString() === senderWorkspace.userId.toString()
      );

      if (!alreadyHasAccess) {
       
          invitedUserWorkspace.permissions.push({ userId: senderWorkspace.userId, accessLevel });
          await invitedUserWorkspace.save();
          return res.status(200).json({ message: 'User invited successfully!'});
      }
      return res.status(200).json({ message: 'You already have access to this workspace.' });
     
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// ========link invite
// router.get('/:workspaceId/join', async (req, res) => {
//   const { workspaceId } = req.params;
//   const { accessLevel } = req.query;

//   try {
//       // Validate access level
//       if (!['view', 'edit'].includes(accessLevel)) {
//           return res.status(400).json({ error: 'Invalid access level' });
//       }

//       // Verify the workspace exists
//       const workspace = await Workspace.findById(workspaceId);
//       if (!workspace) {
//           return res.status(404).json({ error: 'Workspace not found' });
//       }

//       res.status(200).json({ workspaceId, accessLevel });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Route to handle joining a workspace via shareable link
router.get('/:workspaceId/join',authenticate, async (req, res) => {
    const { workspaceId } = req.params; // Sender's workspace ID
    const { accessLevel } = req.query; // Access level from the link
    const userId = req.userId;

    try {
      if (!['view', 'edit'].includes(accessLevel)) {
        return res.status(400).json({ message: 'Invalid access level' });
    }

       
        if (!userId) {
            return res.status(401).json({ error: 'Please log in to join the workspace.' });
        }
 
        const senderWorkspace = await Workspace.findById(workspaceId);
        if (!senderWorkspace) {
            return res.status(404).json({ error: 'Invalid link or workspace not found.' });
        }

       
        const invitedUserWorkspace = await Workspace.findOne({ userId });
        if (!invitedUserWorkspace) {
            return res.status(404).json({ error: 'Your workspace does not exist. Please contact support.' });
        }

        const alreadyHasAccess = invitedUserWorkspace.permissions.some(
            (perm) => perm.userId.toString() === senderWorkspace.userId.toString()
        );

        if (alreadyHasAccess) {
            return res.status(200).json({ message: 'You already have access to this workspace.' });
        }

       
        invitedUserWorkspace.permissions.push({
            userId: senderWorkspace.userId,
            accessLevel: accessLevel || 'view', 
        });
        await invitedUserWorkspace.save();

        return res.status(200).json({ message: 'Access to the workspace has been updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// ============================================================================================================================
// =============================================================================================================================
// =============================================================================================================================
// ========================================create workspace=======================================================
router.post('/create',authenticate, async (req, res)=>{
  const userId = req.userId;
  const user = await User.findOne({ _id: userId });
  const workspaceName = user.name ;
   // const {workspaceName, userId} = req.body;
   try{
       if (!workspaceName || !userId) {
           return res.status(400).json({msg: "Please enter all fields."});
       }

       const workspace = await Workspace.create({
           workspaceName,
           userId
       });
       res.status(200).json({workspace});
   }
   catch(err){
       res.status(500).json({ error: "Failed to create workspace. Please try again." });
       console.log(err)
   }
})

//============================================find user workspace============================================
router.post('/findWorkspace', authenticate, authorizeUserWorkspace, async (req, res)=>{
   const userId = req.userId;
   const workspace = req.workspace;
      try{
       if (!userId) {
           return res.status(400).json({msg: "Please enter all fields."});
       }
       res.status(200).json({workspace});
   }
   catch(err){
       res.status(500).json({ error: "Failed to find workspace. Please try again." });
       console.log(err)
   }
})



// ================================================= in doubt-==============================================
// ======================================accces to all the workspaces =========================================
router.get('/workspaces', async (req, res) => {
  try {
    const userId = req.user.id;

    const ownedWorkspaces = await Workspace.find({ userId });
    const sharedWorkspaces = await Workspace.find({ 'permissions.userId': userId });

    res.status(200).json({
      owned: ownedWorkspaces,
      shared: sharedWorkspaces
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// ==================================================find workspace in edit/view mode =================================
// router.get('/find', authenticate, async (req, res) => {
//   const userId = req.userId;

//   try {
//     // Find the workspace where the user is either the owner or has shared access
//     const workspace = await Workspace.findOne({
//       $or: [
//         { userId }, // Owner
//         { "permissions.userId": userId }, // Shared user
//       ],
//     });

//     if (!workspace) {
//       return res.status(404).json({ success: false, message: 'Workspace not found.' });
//     }

//     // Determine access level for the shared user
//     let accessLevel = 'owner';
//     if (String(workspace.userId) !== String(userId)) {
//       const permission = workspace.permissions.find((perm) => String(perm.userId) === String(userId));
//       accessLevel = permission ? permission.accessLevel : null;
//     }

//     if (!accessLevel) {
//       return res.status(403).json({ success: false, message: 'Access denied.' });
//     }

//     res.json({
//       success: true,
//       workspaceId: workspace._id,
//       accessLevel, // Send the access level (view/edit/owner)
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error.' });
//   }
// });

// router.get('/find', authenticate, async (req, res) => {
//   const userId = req.userId;

//   try {
//     // Fetch all workspaces owned by the user or shared with them
//     const workspaces = await Workspace.find({
//       $or: [
//         { userId }, // Owned by user
//          {"permissions.userId": userId }// Shared with user
//       ],
//     });

//     const ownerWorkspace = await Workspace.findOne({userId});
//     console.log('permissiin',  ownerWorkspace.permissions)

//     if (!workspaces || workspaces.length === 0) {
//       return res.status(404).json({ success: false, message: 'No workspaces found.' });
//     }

//     // Map workspace data to include access level
//     const workspaceData = workspaces.map((workspace) => {
//       let accessLevel = 'owner';
//       if (String(workspace.userId) !== String(userId)) {
//         const permission = workspace.permissions.find((perm) => String(perm.userId) === String(userId));
//         accessLevel = permission ? permission.accessLevel : null;
//       }

//       return {
//         workspaceId: workspace._id,
//         workspaceName: workspace.workspaceName,
//         accessLevel,
//       };
//     });

//     console.log('workspacesss',  workspaces);

//     res.json({ success: true, workspaces: workspaceData , ownerWorkspaceId: ownerWorkspace._id});
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error.' });
//   }
// });
// router.get('/find', authenticate, async (req, res) => {
//   const userId = req.userId;
//   try {
//     // Fetch all workspaces owned by the user or shared with them
//     const workspaces = await Workspace.find({
//       $or: [
//         { userId }, // Owned by user
//         { "permissions.userId": userId }, // Shared with user
//       ],
//     });
//     const ownerWorkspace = await Workspace.findOne({userId});
//         console.log('permissiin',  ownerWorkspace.permissions)

//     if (!workspaces || workspaces.length === 0) {
//       return res.status(404).json({ success: false, message: 'No workspaces found.' });
//     }

//     // Map workspace data to include access level
//     const workspaceData = workspaces.map((workspace) => {
//       let accessLevel = 'owner';
//       if (String(workspace.userId) !== String(userId)) {
//         const permission = workspace.permissions.find((perm) => String(perm.userId) === String(userId));
//         accessLevel = permission ? permission.accessLevel : null;
//       }

//       return {
//         workspaceId: workspace._id,
//         workspaceName: workspace.workspaceName,
//         accessLevel,
//       };
//     });
//     console.log("Fetched workspaces:", workspaces);
// workspaces.forEach((workspace) => {
//   console.log("Workspace permissions:", workspace.permissions);
// });
   
//     // Send the data
//     res.json({ success: true, workspaces: workspaceData });
//   } catch (error) {
//     console.error('Error in /find route:', error);
//     res.status(500).json({ success: false, message: 'Server error.' });
//   }
// });
router.get('/find', authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    
    const myWorkspace = await Workspace.findOne({ userId });
    if (!myWorkspace) {
      return res.status(404).json({ success: false, message: 'Your workspace not found.' });
    }

    const userPermissionsFromMyWorkspace = myWorkspace.permissions.map(permission => ({
      userId: permission.userId,
      accessLevel: permission.accessLevel,
    }));
  
    const otherUsersWorkspaces = await Workspace.find({
      userId: { $in: userPermissionsFromMyWorkspace.map(permission => permission.userId) },
    });

 
 const workspaceData = [
  {
    workspaceId: myWorkspace._id,
    workspaceName: myWorkspace.workspaceName,
    accessLevel: 'owner',
    forms: myWorkspace.forms,
    folders: myWorkspace.folders,
  },
  
  ...otherUsersWorkspaces.map(workspace => {
    const permission = userPermissionsFromMyWorkspace.find(
      perm => String(perm.userId) === String(workspace.userId)
    );
    return {
      workspaceId: workspace._id,
      workspaceName: workspace.workspaceName,
      accessLevel: permission ? permission.accessLevel : null,
    };
  }),
];
res.json({ success: true, workspaces: workspaceData });

  } catch (error) {
    console.error('Error in find route:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});
// ================================================= 

router.get('/details/:workspaceId', authenticate, async (req, res) => {
  const { workspaceId } = req.params;
  const userId = req.userId;
  
  try {
    const ownerWorkspace = await Workspace.findOne({ userId });

    // Find the workspace by ID and verify access
    const workspace = await Workspace.findById(workspaceId);
    console.log('workspce of edit/view', workspaceId)

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found.' });
    }

   // Step 4: Find the accessLevel of the target workspace in the ownerWorkspace's permissions
   const permission = ownerWorkspace.permissions.find(
    perm => String(perm.userId) === String(workspace.userId)
  );
  let access = null;
  if (workspace.userId.equals(userId)) { 
    access = 'owner'
  }

    const accessLEVEL= access ?'owner' : permission.accessLevel;
    console.log(permission)
    // Send workspace details including forms and folders
    res.json({
      success: true,
      workspaceID: workspace._id,
      workspaceNAME: workspace.workspaceName,
      accessLEVEL,
      formS: workspace.forms,
      folderS: workspace.folders,
    });
  } catch (error) {
    console.error('Error fetching workspace details:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});


router.post('/track-form-access/:workspaceId/:formId', async (req, res) => {
    const { workspaceId, formId } = req.params;
    const { shouldIncrement } = req.body; // Flag from frontend
    
    if (!shouldIncrement) {
        return res.status(200).send('No increment required');
    }

    try {
        // Find the workspace by its ID and the form inside it
        const workspace = await Workspace.findOne({
            _id: workspaceId,
            'forms._id': formId  // Make sure the form exists inside the workspace
        });

        if (!workspace) {
            return res.status(404).send('Workspace or Form not found');
        }

        // Find the form inside the workspace
        const form = workspace.forms.find(f => f._id.toString() === formId);

        // Increment the accessCount for the found form
        form.accessCount += 1;
        // Save the updated workspace
        await workspace.save();

        res.status(200).json({
          message: `Form access count updated. ${form.accessCount}`
        } );
    } catch (err) {
        console.error('Error tracking form access:', err);
        res.status(500).send('Error tracking form access');
    }
});

router.post('/track-form-event/:workspaceId/:formId', async (req, res) => {
  const { workspaceId, formId } = req.params;
  const { type } = req.body; // 'start' for input submission, 'final' for final form submission

  try {
      const workspace = await Workspace.findOne({
          _id: workspaceId,
          'forms._id': formId,
      });

      if (!workspace) {
          return res.status(404).json({msg:'Workspace or Form not found'});
      }

      const form = workspace.forms.find(f => f._id.toString() === formId);

      if (type === 'start') {
          form.formStart += 1;
      } else if (type === 'final') {
          form.formSubmission += 1;
      }

      await workspace.save();
      res.status(200).json({msg:'Form event tracked successfully'});
  } catch (err) {
      console.error('Error tracking form event:', err);
      res.status(500).json({msg:'Error tracking form event'});
  }
});


// server.js
router.post('/forms/:workspaceId/:formId/submit', async (req, res) => {
  const { workspaceId, formId } = req.params;
  const { inputValues } = req.body;

  try {
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) return res.status(404).json({msg: 'Workspace not found'});

      const form = workspace.forms.id(formId);
      if (!form) return res.status(404).json({msg:'Form not found'});

      // Push the submitted values into the form's submissions field
      
    // form.submissions.push(new Map(Object.entries(inputValues))); 
    form.submissions.push({
  data: new Map(Object.entries(inputValues)),
  createdAt: new Date()
});

    await workspace.save();

      res.status(200).json({msg:'Form submission saved'});
  } catch (error) {
      console.error(error);
      res.status(500).json({msg:'Error saving submission'});
  }
});



router.get('/forms/:workspaceId/:formId/submissions', async (req, res) => {
  const { workspaceId, formId } = req.params;

  try {
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) return res.status(404).send('Workspace not found');

      const form = workspace.forms.id(formId);
      if (!form) return res.status(404).send('Form not found');

      res.status(200).json(form.submissions);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching submissions');
  }
});



module.exports = router;
