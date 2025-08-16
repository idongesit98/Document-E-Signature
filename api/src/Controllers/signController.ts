import { Request,Response } from "express";
import { viewDocument,signDocument } from "../services/signService/signService";
import { error } from "console";

export const viewDoc = async(req:Request,res:Response) =>{
    try {
        const envelopeId = req.params.envelopeId;
        const recipientId = req.params.recipientId;

        const viewResponse = await viewDocument(envelopeId,recipientId)
        res.status(viewResponse.code).json({success:true,message:"Document viewed successfully",data:viewResponse})
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Document viewed successfully"
        res.status(500).json({success:false,message:"Documents viewed successfully",error:errorMessage})
    }
}

export const signDoc = async(req:Request,res:Response) =>{
    try {
        const { signatureType,signatureText} = req.body;
        const signerId = req.user!.id;
        const {documentId} = req.params;

        if (!signatureText || signatureText.trim() ==="") {
            res.status(400).json({error:"Signature text is required"})
            return;
        }

        const signResponse = await signDocument(signerId,documentId,signatureType,signatureText)
        res.status(signResponse.code).json({data:signResponse})
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Document viewed successfully"
        res.status(500).json({success:false,message:"Documents viewed successfully",error:errorMessage})
    }
}

