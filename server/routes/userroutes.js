import express from 'express';
import {login, logout, register } from "../controllers/usercontrol.js";

import userauth from '../middlewares/userauthentication.js';

const authroutes =express.Router();
authroutes.use(userauth);
authroutes.post('/register' ,register);
authroutes.post('/login' ,login);
authroutes.post('/logout' ,logout);


export default authroutes;