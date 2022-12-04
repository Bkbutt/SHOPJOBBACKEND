const express= require('express');
const router = express.Router();
require('../db/conn');
const fs = require('fs');
const User = require('../models/userSchema');
const Post = require('../models/postSchema')
const bcrypt= require('bcryptjs');
const { findOne } = require('../models/userSchema');
const jwt = require('jsonwebtoken');   // const middleware = (req,res,next)=>{console.log('i am middleware'); next();}
const     cokiparser    = require('cookie-parser');
const jobPost = require('../models/postSchema');
// const profile = require('../models/profileSchema');
const e = require('express');

const  protect  = require('../middleware/authMiddleware.js')
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
const { VERSION } = require('handlebars/runtime');

// router.get('/findjobs',(req,res)=>{res.send('here you can see jobs offeredd')});


          
// fill post job form 
router.post('/postjob', protect, async(req,res)=>{ 
      const {shopname,postimg,jobname,timing,shoploc,age, workersReq,experience,salary,description}= req.body;//11
      if(!shopname||!jobname||!timing||!shoploc||!workersReq||!salary){ //6 required credentials
            return res.status(422).json({error:"Please fill the required fields"}); 
      }
      try{
            const post = new jobPost(req.body);//no need to write all values
            post.user_id= req.user._id;        // post.user_id=currentuser; 
            post.username = req.user.name;
            post.user_email=req.user.email;
            post.userpic = req.user.userimg;             //same userimgfield schemain err
            await post.save();
            return res.status(200).json({message:'Job Posted Successfully🤎👍'});
      } catch(err){
            console.log(err);
            return res.status(400).json({err});
      }                       
});


//update post
router.put('/post/:id', protect, async(req,res) => {
      try {
            const update = req.body;   // {timing:12am to 6pm, shopname:newname} things to updated
            const post = await jobPost.findByIdAndUpdate(req.params.id, update, { new: true } );  //args,(req.params error)
            console.log("user after findByIdAndUpdate", post);
            res.status(200).json({success: true, UpdatedPost: post });
      } catch (error) {
          console.log("Error in updating Post", error);
          res.status(400).json({error: "Oops! JobPost is not updated."});
      }
});




//delete post

router.delete('/post/:id', protect, async(req,res) => {
      try {
            let post = await jobPost.findByIdAndDelete(req.params.id);
            console.log("deleted post ", post);
            if(post===null)                                                                     //(!post),(post=null) only works if already deleted
              { return res.status(404).json({message:" Post doesn't exist!"});}
            res.status(200).json({ success: true, message: "Post Deleted Successfully ✔" });
      } catch (error) {
          console.log("error in deleting post");
          res.status(400).json({error: "Oops! Post not deleted🚫"});
      }
});
  



//get my posts

router.get('/myposts', protect, async(req,res) => {
      try {
            // console.log("req.user in myposts:", req.user)
            let posts = await jobPost.find({user_id: req.user._id}); 
           console.log("Your posted jobs are : ",posts);                              //empty array userid nothing
            res.status(200).json({ success: true, yourPOSTS : posts });
      } catch (error) {
          console.log("error in get my post",error);
          res.status(400).json({error: "Unable to get posts"});
      }
});
          


//get all posts

router.get('/posts', protect, async(req,res) => {
      try {
            
            const post = await jobPost.find({});      
            res.status(200).json({ success: true, AllPosts: post }) //can pate null logic
      } catch (error) {
          console.log("error in getting posts")
          res.status(400).json({error: "Oops! Unable to get Job Posts"})
      }
});




// search


router.get('/post/search',async(req,res) => {
      try {
            console.log('In try block')
            let { shopname, shoploc,jobname,  } = req.query;
            let post = await jobPost.find(
                   {
                   $or:[
                           {shopname: {"$regex":  "/.*"+shopname+".*/"}}, //, $options:i
                           { shoploc: {"$regex": ".*"+shoploc+".*",} }    ,
                           { jobname: {"$regex": ".*"+jobname+".*"} }     
                         ]
                   });
            console.log("data in posts",post);
            res.status(200).json({ success: true, data: post })
      } catch (error) {
          console.log("error in getting user")
          res.status(400).json({error: "error in getting related Posts info"})
      }
});


      
          
//apply for a job

router.post('/applyjob',protect, async(req,res)=>{
      //if not fields return error fields are necessary
          console.log("in the apply")
      try {
             let  replacements = req.body 
            //  let receiverEmail= jobPost.find
            let  receiverEmail = req.body.receiverEmail
            try  {
                  transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                              user: "bkbutt444@gmail.com",
                              pass: "nkdzbxmyuusdjtwg"
                        }
                        
                  });
                  readHTMLFile('./htmlTemplate/email.html', function(err, html) {
                        var template = handlebars.compile(html)
                        const htmlToSend = template(replacements);

                        var mailOptions = {
                        from: 'shopJOB <foobar@example.com>',
                        to: `${receiverEmail}`,
                        subject: "Email for Job Application",
                        html: htmlToSend   
                  };

                  transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                              console.log(error);
                        } else {
                              console.log('Email sent: '+ info.response );
                              return res.status(200).json({message:'Email Sent!'});
                        }
                  });  
                  }); 
            } catch (error) {
                  console.log(error);   
                  return res.status(400).json({error:error});
       
            } 
            
      } catch(err){
            console.log(err);
      }                       
});
   

module.exports = router;





   var readHTMLFile = function(path, callback)   {
          fs.readFile(path, {encoding: 'utf-8'} ,(err, html)=> {
              if ( err) {
                  throw err;
                  callback(err);
              }  
              else {
                  callback(null, html)
              }
        });
   };




// shopname:/.*shopname.*/i  ,  
// shoploc:/.*shoploc.*/i   ,
// jobname: /.*jobname.*/i 
// search
// router.get('/post/search',async(req,res) => {
//       try {
//             let { jobname, shoploc, shopname } = req.query;  //in strin url
//             let search = {};
//             if(jobname){
//                   search["jobname"] = jobname;
//             }
//             if(shoploc){
//                   search["shoploc"] = shoploc;
//             }
//             if(shopname){
//                   search["shopname"] = shopname;
//             }
            
//             let post = await Post.find(search); 
//             res.status(200).json({ success: true, data: post })
//       } catch (error) {
//           console.log("error in getting user")
//           res.status(400).json({error: "error in getting user info"})
//       }
// });
