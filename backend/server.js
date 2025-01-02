const express = require("express");
const mongoose = require('mongoose');
const app = express();
// const port = process.env.PORT || 3000;
const port = 3000;

const cookieParser = require('cookie-parser');
require('dotenv').config();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const routerUser = require('./Routes/User.js');

const cors = require('cors');
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use('/user', routerUser);
app.use('/workspace', require('./Routes/Workspace.js'));

// ====================================================================================================//
app.listen(port, ()=>{
    console.log("-------Listening on port,", port, "------------");    
})

mongoose.connect(process.env.MONGOOSE_URI)
    .then(()=>{
    console.log("connected to mongodb atlas");
}).catch((err)=>{
    console.log("Error connecting to mongodb: " , err);
});

app.get('/', (req, res)=>{
    res.send("Hello from server of formbot");
})




