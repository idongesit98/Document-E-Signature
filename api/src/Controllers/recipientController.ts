import { Request,Response } from "express";
import { addRecipientEnvelope, listRecipientForEnvelope } from "../services/reciepientService/recipientService";

export const addRecipient = async(req:Request,res:Response) => {
    try {
        const envelopeId = req.params.envelopeId;
        const {email,role} = req.body;

        const recipientResponse = await addRecipientEnvelope(envelopeId,email,role);
        res.status(recipientResponse.code).json({recipientResponse})
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Recipient not added"
       res.status(500).json({success:false,message:"No recipients added",error:errorMessage})
    }
}

export const listRecipients = async(req:Request,res:Response) =>{
    try {
        const envelopeId = req.params.envelopeId;
        const recipients = await listRecipientForEnvelope(envelopeId);
        res.status(recipients.code).json({recipients})
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Recipient not added"
        res.status(500).json({success:false,message:"No recipients added",error:errorMessage})
    }
}
