"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const documentController_1 = require("../controllers/documentController");
const cloudinary_1 = require("../utils/config/cloudinary");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticate);
router.post("/upload", cloudinary_1.upload.single("file"), documentController_1.uploadPdf);
router.get("/all", documentController_1.getAllUploaded);
router.get("/:envelopeId/:documentId/download", documentController_1.downloadSignedDocument);
router.get("/cloud/:publicId", documentController_1.downloadFileFromCloud);
router.put("/move", documentController_1.moveToEnvelope);
exports.default = router;
