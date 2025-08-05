import express from 'express';
import { viewDoc,signDoc } from '../controllers/signController';

const router = express.Router();

router.get("/:envelopeId/:recipientId/view", viewDoc);
router.post("/:envelopeId/:recipientId/sign", signDoc);

export default router;