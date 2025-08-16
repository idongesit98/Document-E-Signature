import express from "express";
import { uploadPdf,getAllUploaded, downloadSignedDocument, moveToEnvelope, downloadFileFromCloud} from "../controllers/documentController";
import { upload } from "../utils/config/cloudinary";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();
 
router.use(authenticate)

router.post("/upload",upload.single("file"),uploadPdf)
router.get("/all",getAllUploaded)
router.get("/:envelopeId/:documentId/download",downloadSignedDocument)
router.get("/cloud/:publicId",downloadFileFromCloud)
router.put("/move",moveToEnvelope)

export default router;

