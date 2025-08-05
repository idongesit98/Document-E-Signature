"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const recipientController_1 = require("../controllers/recipientController");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticate);
router.post("/add/:envelopeId", recipientController_1.addRecipient);
router.get("/list/:envelopeId", recipientController_1.listRecipients);
exports.default = router;
