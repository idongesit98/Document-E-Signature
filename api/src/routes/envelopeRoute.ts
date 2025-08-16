import { Router } from "express";
import { createUserEnvelope,getSingleEnvelope,getAll,sendAnEnvelope } from "../controllers/envelopeController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticate)

router.post("/create",createUserEnvelope);
router.get("/all",getAll);
router.get("/:envelopeId/single",getSingleEnvelope);
router.post("/:envelopeId/send",sendAnEnvelope)

export default router;