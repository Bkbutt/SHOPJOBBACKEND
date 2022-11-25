
const { default: mongoose } = require('mongoose');
const mangoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const bcryptinzi = require('bcrypt-inzi');
// const { select } = require('underscore');
const jwt = require('jsonwebtoken');


const profileSchema = mongoose.Schema({
    // email:{ type: String , required: true, Unique:true} , not req in profile
    // password:{ type: String , required : true} ,
    //  cpassword:{ type: String , required : true} ,
  
     name:{ type: String , required : true} ,
      city:{ type: String , required: true},
      dob:{ type: Date , required: true} ,
  
     address:{ type: String , required:true} ,
     phoneno:{ type: Number } ,
     
     Qualification:{ type: String },
     });


     const profile = mongoose.model('PROFILE',profileSchema);
     module.exports = profile;
  