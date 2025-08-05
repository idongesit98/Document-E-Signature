import { Request,Response } from "express";
import { allEnvelopes, createEnvelope,getEnvelopeById, sendEnvelope } from "../services/envelopeService/envelopeService";

export const createUserEnvelope = async (req:Request,res:Response) => {
    try {
        const {title,description} = req.body
       //const userId = req.user.id
        //const createResponse = await createEnvelope(userId,title,description)
        //res.status(createResponse.code).json(createResponse)
    } catch (error:any) {
        res.status(400).send({success:false,message:error.message})
    }
}

export const getSingleEnvelope = async(req:Request,res:Response) =>{
    const id = req.params.id;
    try {
        const envelopes = await getEnvelopeById(id)
        res.status(envelopes.code).json(envelopes)
    } catch (error:any) {
        res.status(404).send({success:false,message:error.message})
    }
};

export const getAll = async(req:Request,res:Response) =>{
    const id = req.params.id
    try {
        const Allenvelopes = await allEnvelopes(id);
        res.status(Allenvelopes.code).json(Allenvelopes)
    } catch (error:any) {
        res.status(500).send({success:false,message:error.message})
    }
}

export const sendAnEnvelope = async(req:Request,res:Response) =>{
    const id = req.params.id
    try {
        const SendEnvelope = await sendEnvelope(id)
        res.status(SendEnvelope.code).json(SendEnvelope)
    } catch (error:any) {
        res.status(400).json({success:false,error:error.message})
    }
}
