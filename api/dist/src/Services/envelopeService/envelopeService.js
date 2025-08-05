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
exports.sendEnvelope = exports.allEnvelopes = exports.getEnvelopeById = exports.createEnvelope = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../../utils/config/database"));
const envelopeHistory_1 = require("../history/envelopeHistory");
const createEnvelope = (userId, title, description) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existing = yield database_1.default.envelope.findUnique({ where: { title: title } });
        if (existing) {
            return {
                code: 400,
                success: false,
                message: "Envelope already exists",
                data: null
            };
        }
        const newEnvelope = yield database_1.default.envelope.create({
            data: {
                title,
                uploaderId: userId,
                description
            }
        });
        yield (0, envelopeHistory_1.logAction)({ envelopeId: userId, action: "Envelope sent" });
        return {
            code: 201,
            success: true,
            message: "Envelope created successfully",
            data: { newEnvelope }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error creating envelope";
        return {
            code: 500,
            success: false,
            message: errorMessage
        };
    }
});
exports.createEnvelope = createEnvelope;
const getEnvelopeById = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getEnvelopeById = yield database_1.default.envelope.findUnique({
            where: { id: userid },
            include: {
                recipients: true,
                uploader: true,
                documents: true
            }
        });
        if (!getEnvelopeById) {
            return {
                code: 404,
                success: false,
                message: "Envelope not found",
                data: null
            };
        }
        return {
            code: 200,
            success: true,
            message: "Envelope found",
            data: { getEnvelopeById }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error finding envelope";
        console.error(errorMessage);
        return {
            code: 500,
            success: true,
            message: errorMessage
        };
    }
});
exports.getEnvelopeById = getEnvelopeById;
const allEnvelopes = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllEnvelopes = yield database_1.default.envelope.findMany({
            where: { id: userId },
            include: {
                recipients: true,
                uploader: true,
                documents: true
            }
        });
        if (getAllEnvelopes.length === 0) {
            return {
                code: 404,
                success: true,
                message: "No envelope created by user",
                data: null
            };
        }
        return {
            code: 200,
            success: true,
            message: "Envelopes found",
            data: { getAllEnvelopes }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Couldn't find envelopes";
        console.error(errorMessage);
        return {
            code: 500,
            success: true,
            message: errorMessage
        };
    }
});
exports.allEnvelopes = allEnvelopes;
const sendEnvelope = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sending = yield database_1.default.envelope.update({
            where: { id: userid },
            data: {
                status: client_1.EnvelopeStatus.SENT
            }
        });
        return {
            code: 200,
            success: true,
            message: "Envelope sent successfully",
            data: { sending }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error sending envelope";
        console.error(errorMessage);
        return {
            code: 500,
            success: true,
            message: errorMessage
        };
    }
});
exports.sendEnvelope = sendEnvelope;
