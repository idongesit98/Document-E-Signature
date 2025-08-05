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
exports.listRecipients = exports.addRecipient = void 0;
const recipientService_1 = require("../services/reciepientService/recipientService");
const addRecipient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const envelopeId = req.params.envelopeId;
        const { email, role } = req.body;
        const recipientResponse = yield (0, recipientService_1.addRecipientEnvelope)(envelopeId, email, role);
        res.status(recipientResponse.code).json({ recipientResponse });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Recipient not added";
        res.status(500).json({ success: false, message: "No recipients added", error: errorMessage });
    }
});
exports.addRecipient = addRecipient;
const listRecipients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const envelopeId = req.params.envelopeId;
        const recipients = yield (0, recipientService_1.listRecipientForEnvelope)(envelopeId);
        res.status(recipients.code).json({ recipients });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Recipient not added";
        res.status(500).json({ success: false, message: "No recipients added", error: errorMessage });
    }
});
exports.listRecipients = listRecipients;
