"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auditTrailController_1 = require("../controllers/auditTrailController");
const router = express_1.default.Router();
router.post("/create-history/:envelopeId", auditTrailController_1.logHistory);
router.get("/single/:envelopeId", auditTrailController_1.getSingleHistory);
exports.default = router;
