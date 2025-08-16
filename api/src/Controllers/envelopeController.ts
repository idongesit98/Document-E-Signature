import { Request,Response } from "express";
import { allEnvelopes, createEnvelope,getEnvelopeById, sendEnvelope } from "../services/envelopeService/envelopeService";

export const createUserEnvelope = async (req:Request,res:Response) => {
    try {
        const {title,description,recipients,documents} = req.body
        const userId = req.user!.id

        const createResponse = await createEnvelope(userId,title,description,recipients,documents)
        res.status(createResponse.code).json(createResponse)
    } catch (error:any) {
        res.status(400).send({success:false,message:error.message})
    }
}

export const getSingleEnvelope = async(req:Request,res:Response) =>{
    const envelopeId = req.params.envelopeId;
    try {
        const envelopes = await getEnvelopeById(envelopeId)
        res.status(envelopes.code).json(envelopes)
    } catch (error:any) {
        res.status(404).send({success:false,message:error.message})
    }
};

export const getAll = async(req:Request,res:Response) =>{
    try {
        const userId = req.user!.id
        const Allenvelopes = await allEnvelopes(userId);
        res.status(Allenvelopes.code).json(Allenvelopes)
    } catch (error:any) {
        res.status(500).send({success:false,message:error.message})
    }
}

export const sendAnEnvelope = async(req:Request,res:Response) =>{
    const envelopeId = req.params.envelopeId
    try {
        const SendEnvelope = await sendEnvelope(envelopeId)
        res.status(SendEnvelope.code).json(SendEnvelope)
    } catch (error:any) {
        res.status(400).json({success:false,error:error.message})
    }
}
