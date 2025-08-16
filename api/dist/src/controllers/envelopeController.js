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
exports.sendAnEnvelope = exports.getAll = exports.getSingleEnvelope = exports.createUserEnvelope = void 0;
const envelopeService_1 = require("../services/envelopeService/envelopeService");
const createUserEnvelope = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, recipients, documents } = req.body;
        const userId = req.user.id;
        const createResponse = yield (0, envelopeService_1.createEnvelope)(userId, title, description, recipients, documents);
        res.status(createResponse.code).json(createResponse);
    }
    catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});
exports.createUserEnvelope = createUserEnvelope;
const getSingleEnvelope = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const envelopeId = req.params.envelopeId;
    try {
        const envelopes = yield (0, envelopeService_1.getEnvelopeById)(envelopeId);
        res.status(envelopes.code).json(envelopes);
    }
    catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
});
exports.getSingleEnvelope = getSingleEnvelope;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const Allenvelopes = yield (0, envelopeService_1.allEnvelopes)(userId);
        res.status(Allenvelopes.code).json(Allenvelopes);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});
exports.getAll = getAll;
const sendAnEnvelope = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const envelopeId = req.params.envelopeId;
    try {
        const SendEnvelope = yield (0, envelopeService_1.sendEnvelope)(envelopeId);
        res.status(SendEnvelope.code).json(SendEnvelope);
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
exports.sendAnEnvelope = sendAnEnvelope;
