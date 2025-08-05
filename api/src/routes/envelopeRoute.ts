import { Router } from "express";
import { createUserEnvelope,getSingleEnvelope,getAll,sendAnEnvelope } from "../controllers/envelopeController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticate)

router.post("/create",createUserEnvelope);
router.get("/all",getAll);
router.get("/:id",getSingleEnvelope);
router.post("/:id/send",sendAnEnvelope)

export default router;