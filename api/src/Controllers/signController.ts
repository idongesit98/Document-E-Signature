import { Request,Response } from "express";
import { viewDocument,signDocument } from "../services/signService/signService";

export const viewDoc = async(req:Request,res:Response) =>{
    try {
        const envelopeId = req.params.envelopeId;
        const recipientId = req.params.recipientId;

        const viewResponse = await viewDocument(envelopeId,recipientId)
        res.json(viewResponse.code).json({success:true,message:"Document viewed successfully"})
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Document viewed successfully"
        res.status(500).json({success:false,message:"Documents viewed successfully",error:errorMessage})
    }
}

export const signDoc = async(req:Request,res:Response) =>{
    try {
        const envelopeId = req.params.envelopeId;
        const recipientId = req.params.recipientId;

        const signResponse = await signDocument(envelopeId,recipientId)
        res.json(signResponse.code).json({success:true,message:"Document signed successfully"})
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Document viewed successfully"
        res.status(500).json({success:false,message:"Documents viewed successfully",error:errorMessage})
    }
}
