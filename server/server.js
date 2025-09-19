import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

import connectDB from './config/mongodb.js';


const app = express();
const port =process.env.PORT|| 4000 ;

connectDB();
const allowedorigin =['http://localhost:5173'];
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedorigin ,credentials:true}));


//API end points 
app.get('/', (req, res) => {
 res.send("API working");//to chk the server running this should be on screen 
});


app.listen(port, ()=> {
    console.log(`server running on port: ${port}`);

});
