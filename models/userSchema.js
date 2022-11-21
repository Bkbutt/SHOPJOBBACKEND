const { default: mongoose } = require('mongoose');
const mangoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const bcryptinzi = require('bcrypt-inzi');
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
  email:{ type: String , required: true, Unique:true} ,
  password:{ type: String , required : true} ,
   cpassword:{ type: String , required : true} ,

   name:{ type: String , required : true} ,
    city:{ type: String , required: true},
    dob:{ type: Date , required: true} ,

   address:{ type: String , required:true} ,
   phoneno:{ type: Number, required:true} ,
   
   qualification:{ type: String },
  //  tokens:[  
          //  {
             token:{type: String ,required:true }
          // }
      //  ]
     });

//middleware for pass hashing
userSchema.pre('save', async  function(next){
    console.log('middeleware called before save');
   if (this.isModified('password')){
     this.password =  await bcrypt.hash(this.password,12); // const this.password = .. (not working)
     this.cpassword = await bcrypt.hash(this.cpassword,12);
     console.log('hashed');
    }  
    next();
});

//token 
userSchema.methods.generateAuthToken = async function(){ //_id: this._id, ...this(whole object user return,pehle me bs id token mede rhi thi token chota tha)
     try{
        // console.log('token',token);
       // console.log("this in gen auth token", this)  .{...this }
      let token = jwt.sign({...this},process.env.SECRET_KEY);//left id is of schema
          
        this.token=token;
       // this.tokens= this.tokens.concat({token:token}); //LEFT TOKEN is of userschema.right is of upper generated
        await this.save();
                       // console.log(' token',token);
        return token;      // token
      }
      catch(err){
          console.log(err); 
        }
}
//wanna save signup fileds in  profile schema
 

const User = mongoose.model('USER',userSchema);
module.exports = User;
