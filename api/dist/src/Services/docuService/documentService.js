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
exports.generateCloudinaryDownloadUrl = exports.moveDocument = exports.getSignedDocument = exports.allUploaded = exports.saveFileToDB = void 0;
const client_1 = require("@prisma/client");
const cloudinary_1 = __importDefault(require("../../utils/config/cloudinary"));
const redis_1 = require("../../utils/config/redis");
const prisma = new client_1.PrismaClient();
// export const uploadDocument = async(fileBuffer:Buffer,folder:string = "docusign_clone") =>{
//     try {
//         const result = await cloudinary.uploader.upload_stream(
//             {resource_type: "raw",folder:folder,chunk_size:6_000_000});
//             console.log("Uploaded document: ",result)
//             async(error,result) => {
//                 if (error) return
//             }
//         return{
//             code:200,
//             success:true,
//             data:{
//                 url:result.secure_url,
//                 publicId:result.public_id,
//                 size:result.bytes,
//                 format:result.format,
//                 resourceType:result.resource_type as ResourceType
//             },
//             message:"File uploaded to Cloudinary successfully"
//         };
//     } catch (error:any) {
//         console.error("Upload Error:", error);
//         return {
//             success: false,
//             message: error?.message || "Failed to upload file",
//             error:error,
//         };
//     }
// }
const saveFileToDB = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const saveUploadedFile = prisma.document.create({
        data: {
            name: options.name,
            size: options.size,
            fileUrl: options.url,
            publicId: options.publicId,
            userId: options.userId,
            resourceType: options.resource_type,
            envelopeId: options.envelopeId || null
        }
    });
    return saveUploadedFile;
});
exports.saveFileToDB = saveFileToDB;
const allUploaded = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield prisma.document.findMany({});
        if (allUsers.length === 0) {
            return {
                code: 400,
                success: false,
                message: "Uploaded documents not found",
                data: null
            };
        }
        return {
            code: 200,
            success: true,
            message: "Uploaded documents found",
            data: {
                documents: allUsers
            }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failure to get all documents";
        return {
            code: 500,
            success: false,
            message: errorMessage,
            data: null
        };
    }
});
exports.allUploaded = allUploaded;
const getSignedDocument = (userId, envelopeId, documentId, email) => __awaiter(void 0, void 0, void 0, function* () {
    const envelope = yield prisma.envelope.findUnique({
        where: { id: envelopeId },
        include: {
            recipients: true,
            uploader: true,
            documents: true
        },
    });
    if (!envelope) {
        return {
            code: 404,
            success: false,
            message: "No envelope found",
            data: null
        };
    }
    const owner = envelope.uploaderId === userId;
    const isRecipient = envelope.recipients.some((r) => r.email === email);
    if (!owner && !isRecipient) {
        return {
            code: 403,
            success: false,
            message: "Unauthorized to access this document",
            data: null
        };
    }
    if (envelope.status !== "COMPLETED") {
        return {
            code: 403,
            success: false,
            message: "Documents are only available after completion",
            data: null
        };
    }
    const docs = envelope.documents.find((d) => d.id === documentId);
    if (!docs) {
        return {
            code: 404,
            success: false,
            message: "Document not found",
            data: null
        };
    }
    return {
        code: 200,
        success: true,
        message: "Document found",
        data: { downloadUrl: docs.fileUrl }
    };
});
exports.getSignedDocument = getSignedDocument;
const moveDocument = (documentId, envelopeId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!documentId || !envelopeId || !userId) {
        return {
            code: 400,
            success: false,
            message: "Document,Envelope and User Id not found",
            data: null
        };
    }
    try {
        const updatedDocument = yield prisma.document.update({
            where: { id: documentId },
            data: { envelopeId: envelopeId }
        });
        return {
            code: 200,
            success: true,
            message: "Document moved to Envelope",
            data: { Document: updatedDocument }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error moving Envelope";
        console.error(errorMessage);
        return {
            code: 500,
            success: false,
            message: errorMessage
        };
    }
});
exports.moveDocument = moveDocument;
const generateCloudinaryDownloadUrl = (publicId, resourceType) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `cloudinary:signed:${publicId}`;
    const cached = yield redis_1.redisClient.get(cacheKey);
    if (cached) {
        return {
            success: true,
            url: cached,
            fromCache: true
        };
    }
    try {
        const url = cloudinary_1.default.url(publicId, {
            resource_type: resourceType,
            secure: true,
            sign_url: true
        });
        yield redis_1.redisClient.setEx(cacheKey, 300, url);
        return {
            success: true,
            url,
            fromCache: false,
        };
    }
    catch (error) {
        console.error("Cloudinary signed URL error:", error);
        return {
            success: false,
            message: error || "Failed to generate signed URL",
        };
    }
});
exports.generateCloudinaryDownloadUrl = generateCloudinaryDownloadUrl;
