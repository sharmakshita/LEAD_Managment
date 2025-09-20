import express from "express";
import { createLead, deleteLead, getLeadById, getLeads, updateLead } from "../controllers/leadcontroller.js";

import userauth from "../middlewares/userauthentication.js";

const router = express.Router();
router.use(userauth);
router.post("/" , createLead); //to cretae a lead
router.get("/" , getLeads); //to get the leads
router.get("/:id" , getLeadById); //to get the leads by their ids
router.put("/:id" , updateLead); //to update the satus of leads
router.delete("/:id" , deleteLead); //to delete the leads

export default router;