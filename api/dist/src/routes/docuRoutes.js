"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const documentController_1 = require("../controllers/documentController");
const cloudinary_1 = require("../utils/config/cloudinary");
const router = express_1.default.Router();
router.post("upload", cloudinary_1.upload.single("file"), documentController_1.uploadFile);
router.get("/all", documentController_1.getAllUploaded);
exports.default = router;
