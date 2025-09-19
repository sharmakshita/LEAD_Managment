import mongoose from "mongoose";


const leadsmodel = new mongoose.Schema({
    
    first_name:{type: String , required : true},
    last_name:{type: String , required : true},
    phone: {type: Number , required : true ,unique:true},
    email :{type: String , required : true , unique:true},
    company:{type: String , required : true},
    city:{type: String , required : true},
    state:{type: String , required : true},
    source:{
        type:String,//source from where they got to know 
        enum: ["website", "facebook_ads", "google_ads", "referral", "events", "other"] , 
        default:"website"
    },
    status:{
        type:String,
        enum:["new", "contacted", "qualified", "lost", "won"],
        default:"new"
    },
    score: { type: Number, min: 0, max: 100, default: 0 },
    leadvalue: { type: Number, default: 0 },
    lastactivity: { type: Date, default: null },
    isqualified: { type: Boolean, default: false },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },    
},
{
    timestamps:{createdAt : "created_at" , updatedAt: "updated_at"},
}
);
const leads = mongoose.models.leads || mongoose.model('leads' , leadsmodel);
export default leads; 
