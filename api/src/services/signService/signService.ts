import { SignatureStatus,EnvelopeStatus } from "@prisma/client";
import prisma from "../../utils/config/database";
import { logAction } from "../../services/history/envelopeHistory";
import { embedSignatureToPdf } from "../../utils/config/pdfUtils";
import cloudinary from "../../utils/config/cloudinary";

export const viewDocument = async(envelopeId:string,recipientId:string) =>{
    try {
        const recipient  = await prisma.recipient.update({
            where:{id:recipientId},
            data:{status:SignatureStatus.VIEWED},
        });
        
        await logAction({ envelopeId, action: `Recipient ${recipientId} viewed document` });

        return{
            code:200,
            success:true,
            message:"Document updated correctly",
            data:{recipient}
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Couldnt update document"
        return{
            code:500,
            success:false,
            message:errorMessage,
            data:null
        }
    }
}

export const signDocument = async(documentId:string,signerId:string,signatureText:string,signatureType:"TYPED" | "DRAWN") =>{
    try {
        const document = await prisma.document.findUnique({where:{id:documentId},include:{envelope:true}});
        if (!document) {
            return{
                code:404,
                success:false,
                message:"Document not found"
            };
        }

        let signatureUrl = signatureText

        //Upload to cloudinary if it drawn (base64) signature
        if (signatureType === "DRAWN" && !signatureText.startsWith("http")) {
            const uploadRes = await cloudinary.uploader.upload(signatureText,{folder:"signatures"});
            signatureUrl = uploadRes.secure_url;
        }
        //create or update signature record
        await prisma.signature.upsert({
            where:{signerId_documentId:{signerId,documentId}},
            update:{signature:signatureUrl,signedAt:new Date(), status:"SIGNED"},
            create:{signerId,documentId,signature:signatureUrl,signedAt:new Date()}
        });
        const signedPdfUrl = await embedSignatureToPdf(
            document.publicId,
            signatureType,
            signatureType === "TYPED" ? signatureText : "",
            signatureType === "DRAWN" ? signatureUrl : undefined
        );

        //check if all recipients signed and complete envelope
        const unsignedCount = await prisma.recipient.count({
            where:{envelopeId:document.envelopeId!,status:"PENDING"}
        });
        if (unsignedCount === 0) {
            await prisma.envelope.update({
                where:{id:document.envelopeId!},
                data:{status:"COMPLETED"}
            });
        }
        return{
            code:200,
            success:true,
            message:"Document signed successfully",
            data:{
                Signed:signedPdfUrl
            }
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error signing document"
        return{
            code:500,
            success:false,
            message:errorMessage,
            data:null
        }
    }
}
