const express= require('express');
const router = express.Router();
require('../db/conn');
const User = require('../models/userSchema');
const bcrypt= require('bcryptjs');
const { findOne } = require('../models/userSchema');
const jwt = require('jsonwebtoken');   // const middleware = (req,res,next)=>{console.log('i am middleware'); next();}
const cokiparser    = require('cookie-parser');
const jobPost = require('../models/postSchema');
// const profile = require('../models/profileSchema');
const e = require('express');
const  protect  = require('../middleware/authMiddleware.js')
// const User = require('../models/userSchema');

//all done executed
//get user by id

router.get('/user/:id', protect, async(req,res) => {
    try {
        let user = await User.findById({ _id: req.params.id })            //id:req.params.id mistake(_id: ok).can use findById,not find()
        // console.log("user after find", user),res.status(200).json({success: true, user: user })
        let {email,password,cpassword,name,city,dob,address,phoneno,qualification}= user;//no token return logic
        res.status(200).json({success: true,email,password,cpassword,name,city,dob,address ,phoneno,  qualification  // no need fr email:email since thyre same                  
         });
    } catch (error) {
        console.log("Error in getting user")
        res.status(400).json({error: "Error in getting user info"})
    }
});

//update user /anyfield

router.put('/user/:id',protect, async(req,res) => {
    try {
        let update = req.body
        let user = await User.findByIdAndUpdate(req.params.id, update, { new: true } )
        // console.log("user after findByIdAndUpdate", user)
        // res.status(200).json({success: true, user: user })//token also with user//was active
        let {email,password,cpassword,name,city,dob,address,phoneno,qualification}= user;//no token return logic
        res.status(200).json({success: true,email,password,cpassword,name,city,dob,address ,phoneno,  qualification  // no need fr email:email since thyre same                  
         });

        
    } catch (error) {
        console.log("error in updating user info",error )
        res.status(400).json({error: "error in getting user info"})
    }
});

module.exports = router;


// //get all users
// router.get('/users', async(req,res) => {            //user/:id'
//     try {
//         let user = await User.find({ })             //find({id: req.params.id}) //find{}may be returns all users
//         // console.log("user after find", user)
//         res.status(200).json({success: true, user: user })
//     } catch (error) {
//         console.log("Error in getting user")
//         res.status(400).json({error: "Error in getting user info"})
//     }
// });