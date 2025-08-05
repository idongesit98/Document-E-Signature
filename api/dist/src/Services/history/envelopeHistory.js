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
exports.getAuditTrail = exports.logAction = void 0;
const database_1 = __importDefault(require("../../utils/config/database"));
const logAction = (_a) => __awaiter(void 0, [_a], void 0, function* ({ envelopeId, action }) {
    try {
        const audit = yield database_1.default.auditTrail.create({
            data: {
                envelopeId,
                action
            }
        });
        return {
            code: 200,
            success: true,
            message: "Action logged successfully",
            data: {
                audit
            }
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
exports.logAction = logAction;
const getAuditTrail = (envelopeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAll = yield database_1.default.auditTrail.findMany({
            where: { envelopeId },
            orderBy: { timeStamp: "asc" }
        });
        if (getAll.length === 0) {
            return {
                code: 404,
                success: false,
                message: "Couldn't find history",
                data: null
            };
        }
        return {
            code: 200,
            success: false,
            message: "Trails found",
            data: {
                trails: getAll
            }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "No history";
        return {
            code: 500,
            success: false,
            message: errorMessage,
            data: null
        };
    }
});
exports.getAuditTrail = getAuditTrail;
