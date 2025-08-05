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
const signDocument = (envelopeId, recipientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipient = yield database_1.default.recipient.update({
            where: { id: recipientId },
            data: {
                status: client_1.SignatureStatus.SIGNED,
                signedAt: new Date(),
            }
        });
        //check if all recipients have signed, then updates envelope status
        const all = yield database_1.default.recipient.findMany({
            where: { envelopeId },
        });
        yield (0, envelopeHistory_1.logAction)({ envelopeId, action: `Recipient ${recipientId} signed document` });
        const allSigned = all.every((r) => r.status === client_1.SignatureStatus.SIGNED);
        if (allSigned) {
            yield database_1.default.envelope.update({
                where: { id: envelopeId },
                data: { status: client_1.EnvelopeStatus.COMPLETED },
            });
        }
        return {
            code: 200,
            success: true,
            message: "Signed successfully",
            data: { recipient }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Couldnt sign document";
        return {
            code: 500,
            success: false,
            message: errorMessage,
            data: null
        };
    }
});
exports.signDocument = signDocument;
