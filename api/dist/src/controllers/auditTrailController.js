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
exports.getSingleHistory = exports.logHistory = void 0;
const envelopeHistory_1 = require("../services/history/envelopeHistory");
const logHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const envelopeId = req.params.envelopeId;
        const action = req.body;
        const logResponse = yield (0, envelopeHistory_1.logAction)({ envelopeId, action });
        res.status(logResponse.code).json({ success: true, message: "History logged" });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "History not created";
        res.status(500).json({ success: false, message: "History not created", error: errorMessage });
    }
});
exports.logHistory = logHistory;
const getSingleHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const envelopeId = req.params.envelopeId;
        const allResponse = yield (0, envelopeHistory_1.getAuditTrail)(envelopeId);
        res.status(allResponse.code).json({ success: true, message: "History found" });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "History not found";
        res.status(500).json({ success: false, message: "History not found", error: errorMessage });
    }
});
exports.getSingleHistory = getSingleHistory;
