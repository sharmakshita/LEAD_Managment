import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

import connectDB from './configurations/mongodb.js';


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


app.listen(port, ()=> {
    console.log(`server running on port: ${port}`);

});
