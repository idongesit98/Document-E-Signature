import { Request,Response } from "express";
import { getAuditTrail, logAction } from "../services/history/envelopeHistory";

export const logHistory = async(req:Request,res:Response) =>{
    try {
        const envelopeId = req.params.envelopeId
        const action = req.body

        const logResponse = await logAction({envelopeId,action})
        res.status(logResponse.code).json({success:true,message:"History logged"})
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "History not created"
        res.status(500).json({success:false,message:"History not created",error:errorMessage})
    }
}

export const getSingleHistory = async(req:Request,res:Response) =>{
    try {
        const envelopeId = req.params.envelopeId
        const allResponse = await getAuditTrail(envelopeId)
        res.status(allResponse.code).json({success:true,message:"History found"})
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "History not found"
        res.status(500).json({success:false,message:"History not found",error:errorMessage}) 
    }
}