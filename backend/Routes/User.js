const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../Schema/UserSchema.js');
const bcrypt = require("bcrypt");
const jwt  = require("jsonwebtoken");
const authenticate = require("../middlewares/Authentication.js");
const Workspace = require('../Schema/WorkspaceSchema.js');


// =================================get all users==============================================================
router.get('/' , async(req, res)=>{
    const users = await User.find();
    try{
        res.json({UserList: users});
    }
    catch(err){
        res.send(err);
    }
})

// ========================delete all users==============================================================
router.delete('/deleteAll', async(req, res)=>{
    try{
        await User.deleteMany();
    
        res.json({msg: "All users deleted."});
    }
    catch(err){
        res.send(err);
    }
}
)
// ====================================== signup ==============================================================

router.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ msg: "All fields are required." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ msg: "User with this email already exists." });
    }
    const existingUserName = await User.findOne({ name: username });
    if (existingUserName) {
        return res.status(400).json({ msg: "User with this name already exists." });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match." });
    }
    try {
        const hashPass = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: username,
            email,
            password: hashPass,
        });
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });
        // console.log('token of signin', token);
        res.cookie('Token', token, {
            httpOnly: true,
            maxAge: 5 * 60 * 60 * 1000,
            sameSite: 'None',
            secure: true,
             expires: new Date(Date.now() + 18000000),
        });
        return res.status(200).json({ msg: "User registered and logged in!", user });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ msg: "Server error during signup." });
    }
});

// ======================================login===============================================================
router.post('/login', async (req, res)=>{
    const { email, password } =   req.body;
    const isProduction = true;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({msg:"User does not exists."});
    }

    const payload = { id: existingUser.id }

    // compare password
    bcrypt.compare(password, existingUser.password, (err, isMatch) => { 
        if (err) {
            console.error('Error comparing passwords:', err); 
            return res.status(500).json({ msg: "An error occurred while checking the password." });
          }
        if (isMatch){
            // create token
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"5h"});
            // store token in cokkie
            res.cookie('Token', token, {
              maxAge: 5 * 60 * 60 * 1000,
              httpOnly: true,
              sameSite: 'None',
              secure: true,

//                 secure: false,
//  sameSite: 'Lax',
              expires: new Date(Date.now() + 18000000),
              });
          
            return res.status(200).json({msg: "You are logged in!" ,existingUser});
        } 
        else {
            // Password mismatch
            return res.status(400).json({ msg: "Incorrect password." });
          }
    });
})

// =========================update user details==============================================================
router.put("/update", authenticate, async (req, res) => {
    const userId = req.userId; 
    const { name, email, oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ err: "User not found." });
    }

    if (!name && !email) {
      return res.status(400).json({ err: "At least name or email should be provided." });
    }
  
    if ((oldPassword || newPassword) && !(oldPassword && newPassword)) {
      return res.status(400).json({ err: "Both Old and New passwords are required." });
    }
  
    if (oldPassword && newPassword) {
      bcrypt.compare(oldPassword, user.password, async (err, isMatch) => { 
        if (err) {
          console.error('Error comparing passwords:', err); 
          return res.status(500).json({ message: "An error occurred while checking the password." });
        }
  
        if (!isMatch) {
          return res.status(400).json({ err: "Old password is incorrect." });
        }
  
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save(); 
        return res.status(200).json({ msg: "User updated successfully." });
      });
      return;
    }
    if (name){ 
        user.name = name;

        const workspace = await Workspace.findOne({ userId });
          if (!workspace) {
            return res.status(403).json({ message: 'Access denied: Workspace not found' });
          }
          workspace.workspaceName = name;
          await workspace.save();

    }

    if (email) user.email = email;
    await user.save();
  
    return res.status(200).json({ msg: "User updated successfully." });
  });
  
// ===================================logout============================================
router.post('/logout', authenticate, (req, res) => {
    res.clearCookie('Token', { path: '/' }); 
    return res.status(200).json({ message: 'Logged out successfully' });
  });

  

module.exports = router;
