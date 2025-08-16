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
exports.embedSignatureToPdf = void 0;
const pdf_lib_1 = require("pdf-lib");
const cloudinary_1 = __importDefault(require("./cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const embedSignatureToPdf = (publicId, signatureText, signatureType, signatureImageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    console.log(cloud_name);
    const pdfBuffer = yield fetch(`https://res.cloudinary.com/${cloud_name}/raw/upload/${publicId}.pdf`)
        .then(res => res.arrayBuffer());
    const pdfDoc = yield pdf_lib_1.PDFDocument.load(pdfBuffer);
    const firstPage = pdfDoc.getPages()[0];
    const font = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaOblique);
    if (signatureType === "TYPED") {
        firstPage.drawText(signatureText, {
            x: 150,
            y: 100,
            size: 24,
            font,
            color: (0, pdf_lib_1.rgb)(0, 0, 0)
        });
    }
    else if (signatureType === "DRAWN" && signatureImageUrl) {
        const imgBytes = yield fetch(signatureImageUrl).then(res => res.arrayBuffer());
        const pngImage = yield pdfDoc.embedPng(imgBytes);
        firstPage.drawImage(pngImage, {
            x: 100,
            y: 150,
            width: 200,
            height: 80
        });
    }
    const signedPdfBytes = yield pdfDoc.save();
    const uploadedStream = cloudinary_1.default.uploader.upload_stream({
        resource_type: "raw",
        folder: "signed_pdfs",
        format: "pdf"
    }, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return {
                code: 400,
                success: false,
                message: error.message,
                data: null
            };
        }
        return {
            code: 200,
            success: true,
            message: "Uploaded successfully",
            data: { result }
        };
    }));
    streamifier_1.default.createReadStream(Buffer.from(signedPdfBytes)).pipe(uploadedStream);
});
exports.embedSignatureToPdf = embedSignatureToPdf;
