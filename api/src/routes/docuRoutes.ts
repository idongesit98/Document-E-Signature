import express from "express";
import { uploadFile,getAllUploaded} from "../controllers/documentController";
import { upload } from "../utils/config/cloudinary";

const router = express.Router();

router.post("upload",upload.single("file"),uploadFile)
router.get("/all",getAllUploaded)

export default router;

