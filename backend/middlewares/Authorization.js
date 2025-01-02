// Authorization Middleware: Check if the logged-in user has access to the workspace.

const Workspace = require('../Schema/WorkspaceSchema.js');

const authorizeUserWorkspace = async (req, res, next) => {
  const  userId  = req.userId; 
  try {
  const workspace = await Workspace.findOne({ userId });
  if (!workspace) {
    return res.status(403).json({ message: 'Access denied: Workspace not found' });
  }

  req.workspace = workspace; // Attach workspace to the request
  next(); // Continue to the route handler
} catch (error) {
  res.status(500).json({ message: 'Server error' });
}
};

module.exports= authorizeUserWorkspace;


  