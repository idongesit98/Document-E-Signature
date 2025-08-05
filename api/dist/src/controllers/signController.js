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
exports.signDoc = exports.viewDoc = void 0;
const signService_1 = require("../services/signService/signService");
const viewDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const envelopeId = req.params.envelopeId;
        const recipientId = req.params.recipientId;
        const viewResponse = yield (0, signService_1.viewDocument)(envelopeId, recipientId);
        res.json(viewResponse.code).json({ success: true, message: "Document viewed successfully" });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Document viewed successfully";
        res.status(500).json({ success: false, message: "Documents viewed successfully", error: errorMessage });
    }
});
exports.viewDoc = viewDoc;
const signDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const envelopeId = req.params.envelopeId;
        const recipientId = req.params.recipientId;
        const signResponse = yield (0, signService_1.signDocument)(envelopeId, recipientId);
        res.json(signResponse.code).json({ success: true, message: "Document signed successfully" });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Document viewed successfully";
        res.status(500).json({ success: false, message: "Documents viewed successfully", error: errorMessage });
    }
});
exports.signDoc = signDoc;
