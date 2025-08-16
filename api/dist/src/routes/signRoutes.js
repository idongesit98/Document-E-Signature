"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signController_1 = require("../controllers/signController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticate);
router.get("/:envelopeId/:recipientId/view", signController_1.viewDoc);
router.post("/:documentId/signature", signController_1.signDoc);
exports.default = router;
