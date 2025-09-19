import mongoose from "mongoose";

const usermodel = new mongoose.Schema({
    name:{type: String , required : true},
    phone: {type: Number , required : true ,unique:true},
    email :{type: String , required : true , unique:true},
    role:{
        type:String,//for role based access
        enum: ['admin' , 'user'] , 
        default:'user'
    }

});
const user = mongoose.models.user || mongoose.model('user' , usermodel);
export default user; 
