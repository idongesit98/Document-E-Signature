import { EnvelopeStatus } from "@prisma/client";
import prisma from "../../utils/config/database";
import { logAction } from "../history/envelopeHistory";

export const createEnvelope = async(userId:string,title:string,description:string) =>{
    try {
        const existing = await prisma.envelope.findUnique({where:{title:title}})
        
        if (existing) {
            return{
                code:400,
                success:false,
                message:"Envelope already exists",
                data:null
            }
        }
        const newEnvelope = await prisma.envelope.create({
            data:{
                title,
                uploaderId:userId,
                description
            }
        })
        await logAction({ envelopeId: userId, action: "Envelope sent" });

        return{
            code:201,
            success:true,
            message:"Envelope created successfully",
            data:{newEnvelope}
        }    
    } catch (error) {
       const errorMessage = (error instanceof Error) ? error.message : "Error creating envelope"
        return{
            code:500,
            success:false,
            message:errorMessage
        }
    }
}

export const getEnvelopeById = async (userid:string) => {
    try {
        const getEnvelopeById = await prisma.envelope.findUnique({
            where:{id:userid},
            include:{
                recipients:true,
                uploader:true,
                documents:true
            }
        })

        if (!getEnvelopeById) {
            return{
                code:404,
                success:false,
                message:"Envelope not found",
                data:null
            }
        }
        return{
            code:200,
            success:true,
            message:"Envelope found",
            data:{getEnvelopeById}
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error finding envelope"
        console.error(errorMessage)
        return{
            code:500,
            success:true,
            message:errorMessage
        }
    }
}

export const allEnvelopes = async (userId:string) => {
    try {
        const getAllEnvelopes = await prisma.envelope.findMany({
            where:{id:userId},
            include:{
                recipients:true,
                uploader:true,
                documents:true
            }
        })

        if (getAllEnvelopes.length === 0) {
            return{
                code:404,
                success:true,
                message:"No envelope created by user",
                data:null
            }
        }
        return{
            code:200,
            success:true,
            message:"Envelopes found",
            data:{getAllEnvelopes}
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Couldn't find envelopes"
        console.error(errorMessage)
        return{
            code:500,
            success:true,
            message:errorMessage
        }
    }
}

export const sendEnvelope = async (userid:string) => {
   try {
     const sending = await prisma.envelope.update({
         where:{id:userid},
         data:{
             status:EnvelopeStatus.SENT
         }
     })
     return{
         code:200,
         success:true,
         message:"Envelope sent successfully",
         data:{sending}
     }
   } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error sending envelope"
        console.error(errorMessage)
        return{
            code:500,
            success:true,
            message:errorMessage
        }
   }
}

