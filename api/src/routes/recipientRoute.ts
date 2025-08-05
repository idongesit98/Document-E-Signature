import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { addRecipient, listRecipients } from "../controllers/recipientController";


const router = express.Router();

router.use(authenticate)
router.post("/add/:envelopeId",addRecipient)
router.get("/list/:envelopeId",listRecipients)

export default router;