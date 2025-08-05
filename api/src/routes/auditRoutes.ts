import express from 'express';
import { logHistory,getSingleHistory } from '../controllers/auditTrailController';

const router = express.Router();

router.post("/create-history/:envelopeId",logHistory)
router.get("/single/:envelopeId",getSingleHistory)

export default router;