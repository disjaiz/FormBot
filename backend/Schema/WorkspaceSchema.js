const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  workspaceName: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  folders: [
    {
      folderName: { type: String, required: true },
      forms: [
        {
          formName: { type: String, required: true },
          formData: [
            {
              type: { type: String, enum: ['text', 'image', 'input'], required: true },
              value: { type: String, required: true },
              inputType: { type: String, enum: ['text', 'number', 'email', 'phone', 'date', 'rating', 'button'], default: null },
              scale: { type: Number, default: null }
            }
          ]
        }
      ]
    }
  ],
  forms: [
    {
      accessCount: { type: Number, default: 0 }, 
      formStart: { type: Number, default: 0},
      formSubmission: { type: Number, default:0},
      formName: { type: String, required: true },
      formData: [{
        type: { 
          type: String, 
          enum: ['text', 'image', 'input-text', 'input-phone', 'input-email', 'input-number', 'input-date', 'input-rating', 'input-button'], // Allow all input types
          required: true 
        },
        value: { 
          type: String, 
          required: function() {
            return this.type !== 'input-text' && this.type !== 'input-phone' && this.type !== 'input-email' && this.type !== 'input-number' && this.type !== 'input-date' && this.type !== 'input-rating' && this.type !== 'input-button'; 
          } 
        },
        inputType: { 
          type: String, 
          enum: ['text', 'number', 'email', 'phone', 'date', 'rating', 'button'], 
          default: null 
        },
        scale: { 
          type: Number, 
          default: null 
        },
      }],
      submissions: { 
          type: [{
            data: { type: Map, of: String },
            createdAt: { type: Date, default: Date.now }
          }],
        default: [] 
      }
    }
  ],
  permissions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      accessLevel: { type: String, enum: ['view', 'edit'], required: true } 
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
workspaceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
  });
module.exports = mongoose.model('Workspace', workspaceSchema);




// =======================================================================================================

// 1. Share a Workspace
// Add a new user to the sharedWith array with the desired permission.
// await Workspace.findByIdAndUpdate(
//     workspaceId,
//     { $push: { sharedWith: { userId: targetUserId, permission: 'edit' } } },
//     { new: true }
//   );
  

//   2. Revoke Sharing
// Remove a user from the sharedWith array.
// await Workspace.findByIdAndUpdate(
//     workspaceId,
//     { $pull: { sharedWith: { userId: targetUserId } } },
//     { new: true }
//   );

  
//   Handling Permissions in Code
// View Mode:

// Allow users with permission: 'view' to only fetch and display workspace data.
// const workspace = await Workspace.findById(workspaceId);
// const isViewer = workspace.sharedWith.some(
//   (share) => share.userId.toString() === currentUserId && share.permission === 'view'
// );
// if (!isViewer) throw new Error('Access denied');

// Edit Mode:

// Allow users with permission: 'edit' to make changes.
// const isEditor = workspace.sharedWith.some(
//     (share) => share.userId.toString() === currentUserId && share.permission === 'edit'
//   );
//   if (!isEditor) throw new Error('Edit permission required');
  
