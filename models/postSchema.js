const { default: mongoose } = require('mongoose');
const mangoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postSchema = mongoose.Schema({
    shopname:{ type: String , required: true} ,
     postimg:{ type: String } ,
     userpic:{ type: String } ,

    jobname:{ type: String , required : true} ,

    timing:{ type: String , required : true} ,
    shoploc:{ type: String , required: true},
    age:{ type: Number } ,
  
    workersReq:{ type:Number  , required:true} ,
    experience:{ type: String } ,
    
    salary:{ type: Number ,required:true},
    description:{ type: String },
    user_email:{ type: String, required:true},
    user_id:{ type: String, required:true}, 
    username:{ type: String, required:true}
});


const jobPost = mongoose.model('POST',postSchema);
module.exports = jobPost;




// //token 
// postSchema.methods.generateAuthToken = async function(){
//     try{
//       let token= jwt.sign({_id: this._id},process.env.SECRET_KEY);//left id is of schema
//       this.token=token; // this.tokens= this.tokens.concat({token:token}); //LEFT TOKEN is of userschema.right is of upper generated
//        await this.save();
//        return this.token;
//      }
//      catch(err){
//          console.log(err); 
//        }
// }

  