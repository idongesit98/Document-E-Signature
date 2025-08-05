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
        const { title, description } = req.body;
        //const userId = req.user.id
        //const createResponse = await createEnvelope(userId,title,description)
        //res.status(createResponse.code).json(createResponse)
    }
    catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});
exports.createUserEnvelope = createUserEnvelope;
const getSingleEnvelope = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const envelopes = yield (0, envelopeService_1.getEnvelopeById)(id);
        res.status(envelopes.code).json(envelopes);
    }
    catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
});
exports.getSingleEnvelope = getSingleEnvelope;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const Allenvelopes = yield (0, envelopeService_1.allEnvelopes)(id);
        res.status(Allenvelopes.code).json(Allenvelopes);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});
exports.getAll = getAll;
const sendAnEnvelope = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const SendEnvelope = yield (0, envelopeService_1.sendEnvelope)(id);
        res.status(SendEnvelope.code).json(SendEnvelope);
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
exports.sendAnEnvelope = sendAnEnvelope;
