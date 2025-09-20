import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import router from "./routes/leadsroutes.js";
import connectDB from './configurations/mongodb.js';
import authroutes from "./routes/userroutes.js";



const app = express();
const port =process.env.PORT|| 4000 ;
//to connect mongodb
connectDB();
//middleware
const allowedorigin =['http://localhost:5173'];
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedorigin ,credentials:true}));//to send cookies 


//API end points 
app.get('/', (req, res) => {
 res.send("API working");//to chk the server running this should be on screen 
});

//api paths 
app.use('/api/auth' , authroutes);
app.use('/api/leads',router);



app.listen(port, ()=> {
    console.log(`server running on port: ${port}`);

});
