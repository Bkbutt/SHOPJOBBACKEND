const jwt = require('jsonwebtoken')
const { captureRejectionSymbol } = require('nodemailer/lib/xoauth2')
const User = require('../models/userSchema')

const protect = async (req, res, next) => {
    let token

    
    //console.log("headers data",req.headers.authorization)
    if( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        try {
            token = req.headers.authorization.split(' ')[1]
            const decode =  jwt.verify(token, process.env.SECRET_KEY )
            // console.log('decode',decode);                   
            currentuser = await User.findById(decode._doc._id) //*
            let {_id,email,password,cpassword,name,city,dob,address,phoneno,qualification}=currentuser ;
            req.user = {_id,email,password,cpassword,name,city,dob,address,phoneno,qualification};
            console.log('user active:',req.user);
            next()
        } catch (error) {
            return res.status(401).json({
                msg: 'Access denied! Unauthorized ,  token but inner error'
            })
        }

        
    }
    

    if(!token){
        // console.log('no token')
        return res.status(401).json({
            msg: 'Access denied🚫 Unauthorized! , no token'
        })  
    }
}

module.exports= protect;



// console.log('decode',decode); //user fields encoded in token.encoded user at start
// req.user = await User.findById(decode._doc._id);/contains updated db user,await User.findById(decode._id),decode._doc._id(it was)
//  await User.findById(decode._id), // decode._doc._id(it was) 
//_doc is object containg userfields in decode token.to access user's _id, decode._doc._id used
//req. user is a convenience property that is an alias for req. session. user
//is and identifier only.can use currentuser for its name since it retrives current user(updatesFields)
//  req.user = await User.findById(decode._doc._id)  //*currentdbupdated userwith roken
// console.log('req.user value in mdleWre',req.user);
//myposts; console.log("req.user in myposts:", req.user)//(now has current user data),user is null,so reading nulls props
//uptjb.findByIdAndUpdate(req.params.id, update, { new: true } );  //func 3args (req.params for error)