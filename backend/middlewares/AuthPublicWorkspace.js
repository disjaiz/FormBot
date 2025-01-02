
const Workspace = require('../Schema/WorkspaceSchema.js');

const authPublicWorkspace = async (req, res, next) => {
    const {workspaceId}  = req.body;
    const  userId  = req.userId; 

    try {
      const ownerWorkspace = await Workspace.findOne({ userId });
      const workspace = await Workspace.findById(workspaceId);
  
      if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
  
      // Check if the user is the owner or has shared access
      if ( 
        // workspace.userId.equals(userId) || workspace.permissions.some((perm) => perm.userId.equals(userId)
        workspace.userId.equals(userId) || // The user owns the workspace
        ownerWorkspace.permissions.some((perm) => perm.userId.equals(workspace.userId))
      ) {
        req.workspace = workspace;
        next();
      } else {
        return res.status(403).json({ message: 'Access denied' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message || 'Server error' });
    }
  };

module.exports= authPublicWorkspace;
