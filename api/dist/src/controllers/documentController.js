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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUploaded = exports.uploadFile = void 0;
const documentService_1 = require("../services/docuService/documentService");
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).json({ success: false, message: "No file uploaded" });
        return;
    }
    console.log(req.file);
    const filePath = req.file.path;
    console.log(filePath);
    const uploadResponse = yield (0, documentService_1.uploadDocument)(filePath);
    if (!uploadResponse.success || !uploadResponse.data) {
        res.status(500).json({
            success: false,
            message: uploadResponse.message || "Upload failed",
            error: uploadResponse.error
        });
        return;
    }
    const { url, publicId, size, resourceType } = uploadResponse.data;
    const savedFile = yield (0, documentService_1.saveFileToDB)({
        name: req.file.originalname,
        size,
        url,
        publicId,
        resourceType,
        userId: req.user.id,
        envelopeId: req.body.envelopeId
    });
    res.status(200).json({ success: true, data: savedFile });
    return;
});
exports.uploadFile = uploadFile;
const getAllUploaded = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allResponse = yield (0, documentService_1.allUploaded)();
    res.status(allResponse.code).json(allResponse);
});
exports.getAllUploaded = getAllUploaded;
