import express from 'express';
import { viewDoc,signDoc } from '../controllers/signController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.get("/:envelopeId/:recipientId/view", viewDoc);
router.post("/:documentId/signature", signDoc);

export default router;