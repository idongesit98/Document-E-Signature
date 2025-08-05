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
exports.allUploaded = exports.saveFileToDB = exports.uploadDocument = void 0;
const client_1 = require("@prisma/client");
const cloudinary_1 = __importDefault(require("../../utils/config/cloudinary"));
const prisma = new client_1.PrismaClient();
const uploadDocument = (filePath_1, ...args_1) => __awaiter(void 0, [filePath_1, ...args_1], void 0, function* (filePath, folder = "docusign_clone") {
    try {
        const result = yield cloudinary_1.default.uploader.upload(filePath, {
            resource_type: "auto",
            folder,
        });
        console.log("Uploaded document: ", result);
        return {
            code: 200,
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                size: result.bytes,
                format: result.format,
                resourceType: result.resource_type
            },
            message: "File uploaded to Cloudinary successfully"
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error occured while uploading file";
        return {
            code: 500,
            success: false,
            error: errorMessage,
            data: null
        };
    }
});
exports.uploadDocument = uploadDocument;
const saveFileToDB = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const saveUploadedFile = prisma.document.create({
        data: {
            name: options.name,
            size: options.size,
            fileUrl: options.url,
            publicId: options.publicId,
            userId: options.userId,
            resourceType: options.resourceType,
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
