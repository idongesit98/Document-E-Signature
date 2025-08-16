"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFileFromCloud = exports.moveToEnvelope = exports.downloadSignedDocument = exports.getAllUploaded = exports.uploadPdf = void 0;
const documentService_1 = require("../services/docuService/documentService");
const cloudinary_1 = __importDefault(require("../utils/config/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const database_1 = __importDefault(require("../utils/config/database"));
// export const uploadFile = async(req:Request,res:Response) =>{
//     try {
//         if (!req.file) {
//             res.status(400).json({success:false,message:"No file uploaded"})
//             return;
//         }
//         console.log("Requested file",req.file)
//         const filePath = req.file.buffer;
//         console.log("File path",filePath)
//         const uploadResponse = await uploadDocument(filePath);
//         if (!uploadResponse.success || !uploadResponse.data) {
//         //    res.status(500).json({
//         //         success: false,
//         //         message: uploadResponse.message || "Upload failed",
//         //         error: uploadResponse.error?.error?.message || uploadResponse.error?.message || uploadResponse.error
//         //     });
//         //     return;
//             res.status(500).json({success:false,error:uploadResponse.error})
//             return;
//         }
//         const {url,publicId,size,resourceType} = uploadResponse.data
//         const savedFile = await saveFileToDB({
//             name:req.file.originalname,
//             size,
//             url,
//             publicId,
//             resourceType,
//             userId:req.user!.id,
//             envelopeId:req.body.envelopeId
//         })
//         res.status(200).json({success:true,data:savedFile});
//         return;
//     } catch (error:any) {
//        console.error("Controller Upload Error:", JSON.stringify(error, null, 2));
//         res.status(500).json({
//             success: false,
//             message: error?.message || "Unexpected server error"
//         });
//         return
//     }
// }
const uploadPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const uploadedPdf = cloudinary_1.default.uploader.upload_stream({
            resource_type: "raw",
            folder: "pdfs",
            format: "pdf"
        }, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                console.error("Error uploading PDF:", error);
                res.status(500).json({ message: "Failed to upload PDF." });
                return;
            }
            const savedFile = yield (0, documentService_1.saveFileToDB)({
                name: req.file.originalname,
                size: result.bytes,
                url: result.secure_url,
                resource_type: result.resource_type,
                userId: req.user.id,
                envelopeId: req.body.envelopeId,
                publicId: result.public_id
            });
            res.status(200).json({
                message: "PDF uploaded successfully!",
                data: { savedFile }
            });
        }));
        streamifier_1.default.createReadStream(req.file.buffer).pipe(uploadedPdf);
    }
    catch (error) {
        console.error('Error uploading PDF:', error);
        res.status(500).json({ message: 'Failed to upload PDF.' });
    }
});
exports.uploadPdf = uploadPdf;
const getAllUploaded = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allResponse = yield (0, documentService_1.allUploaded)();
    res.status(allResponse.code).json(allResponse);
});
exports.getAllUploaded = getAllUploaded;
const downloadSignedDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { envelopeId, documentId } = req.params;
        const userId = req.user.id;
        const email = req.user.email;
        const fileUrl = yield (0, documentService_1.getSignedDocument)(userId, envelopeId, documentId, email);
        res.status(fileUrl.code).json({ success: true, message: "Download Url available", data: fileUrl });
    }
    catch (error) {
        res.status(403).json({ error: error.message });
    }
});
exports.downloadSignedDocument = downloadSignedDocument;
const moveToEnvelope = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documentId, envelopeId } = req.body;
        const userId = req.user.id;
        if (!documentId || !envelopeId) {
            res.status(400).json({ success: false, message: "Document and Envelope ID not found" });
            return;
        }
        const documentResponse = yield (0, documentService_1.moveDocument)(documentId, envelopeId, userId);
        res.status(documentResponse.code).json(documentResponse);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error });
    }
});
exports.moveToEnvelope = moveToEnvelope;
const downloadFileFromCloud = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const encodedId = req.params.publicId;
        const publicId = decodeURIComponent(encodedId).trim();
        if (!publicId) {
            res.status(400).json({ success: false, message: "Missing PublicId" });
            return;
        }
        const file = yield database_1.default.document.findFirst({
            where: { publicId },
        });
        console.log("File returned:", file);
        if (!file) {
            res.status(400).json({ success: false, message: "File not found" });
            return;
        }
        const result = yield (0, documentService_1.generateCloudinaryDownloadUrl)(publicId, file.resourceType);
        if (!result.success) {
            res.status(500).json(result.message);
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
        return;
    }
});
exports.downloadFileFromCloud = downloadFileFromCloud;
