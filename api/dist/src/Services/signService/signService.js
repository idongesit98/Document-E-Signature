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
exports.signDocument = exports.viewDocument = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../../utils/config/database"));
const envelopeHistory_1 = require("../../services/history/envelopeHistory");
const pdfUtils_1 = require("../../utils/config/pdfUtils");
const cloudinary_1 = __importDefault(require("../../utils/config/cloudinary"));
const viewDocument = (envelopeId, recipientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipient = yield database_1.default.recipient.update({
            where: { id: recipientId },
            data: { status: client_1.SignatureStatus.VIEWED },
        });
        yield (0, envelopeHistory_1.logAction)({ envelopeId, action: `Recipient ${recipientId} viewed document` });
        return {
            code: 200,
            success: true,
            message: "Document updated correctly",
            data: { recipient }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Couldnt update document";
        return {
            code: 500,
            success: false,
            message: errorMessage,
            data: null
        };
    }
});
exports.viewDocument = viewDocument;
const signDocument = (documentId, signerId, signatureText, signatureType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const document = yield database_1.default.document.findUnique({ where: { id: documentId }, include: { envelope: true } });
        if (!document) {
            return {
                code: 404,
                success: false,
                message: "Document not found"
            };
        }
        let signatureUrl = signatureText;
        //Upload to cloudinary if it drawn (base64) signature
        if (signatureType === "DRAWN" && !signatureText.startsWith("http")) {
            const uploadRes = yield cloudinary_1.default.uploader.upload(signatureText, { folder: "signatures" });
            signatureUrl = uploadRes.secure_url;
        }
        //create or update signature record
        yield database_1.default.signature.upsert({
            where: { signerId_documentId: { signerId, documentId } },
            update: { signature: signatureUrl, signedAt: new Date(), status: "SIGNED" },
            create: { signerId, documentId, signature: signatureUrl, signedAt: new Date() }
        });
        const signedPdfUrl = yield (0, pdfUtils_1.embedSignatureToPdf)(document.publicId, signatureType, signatureType === "TYPED" ? signatureText : "", signatureType === "DRAWN" ? signatureUrl : undefined);
        //check if all recipients signed and complete envelope
        const unsignedCount = yield database_1.default.recipient.count({
            where: { envelopeId: document.envelopeId, status: "PENDING" }
        });
        if (unsignedCount === 0) {
            yield database_1.default.envelope.update({
                where: { id: document.envelopeId },
                data: { status: "COMPLETED" }
            });
        }
        return {
            code: 200,
            success: true,
            message: "Document signed successfully",
            data: {
                Signed: signedPdfUrl
            }
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error signing document";
        return {
            code: 500,
            success: false,
            message: errorMessage,
            data: null
        };
    }
});
exports.signDocument = signDocument;
