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
exports.listRecipientForEnvelope = exports.addRecipientEnvelope = void 0;
const database_1 = __importDefault(require("../../utils/config/database"));
const addRecipientEnvelope = (envelopeId, email, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createRecipient = yield database_1.default.recipient.create({
            data: {
                envelopeId,
                email,
                role
            }
        });
        return {
            code: 201,
            success: true,
            message: "Recipient added successfully",
            data: {
                recipient: createRecipient
            }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error adding recipient";
        return {
            code: 500,
            success: false,
            error: errorMessage,
            data: null,
        };
    }
});
exports.addRecipientEnvelope = addRecipientEnvelope;
const listRecipientForEnvelope = (envelopeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findList = yield database_1.default.recipient.findMany({
            where: { envelopeId },
            orderBy: { createdAt: "asc" },
            include: { envelope: true }
        });
        if (findList.length === 0) {
            return {
                code: 404,
                success: false,
                message: "Recipients List found",
                data: { list: findList }
            };
        }
        return {
            code: 200,
            success: true,
            message: "List found",
            data: {
                list: { findList }
            }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "No list";
        return {
            code: 500,
            success: false,
            message: "Couldnt create list",
            error: errorMessage
        };
    }
});
exports.listRecipientForEnvelope = listRecipientForEnvelope;
