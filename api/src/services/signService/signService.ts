import { SignatureStatus,EnvelopeStatus } from "@prisma/client";
import prisma from "../../utils/config/database";
import { logAction } from "../../services/history/envelopeHistory";

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

export const signDocument = async(envelopeId:string,recipientId:string) =>{
    try {
        const recipient = await prisma.recipient.update({
            where:{id:recipientId},
            data:{
                status:SignatureStatus.SIGNED,
                signedAt: new Date(),
            }
        });
    
        //check if all recipients have signed, then updates envelope status
        const all = await prisma.recipient.findMany({
            where:{envelopeId},
        });
        await logAction({ envelopeId, action: `Recipient ${recipientId} signed document` });
    
        const allSigned = all.every((r) => r.status === SignatureStatus.SIGNED);
        if (allSigned) {
            await prisma.envelope.update({
                where:{id:envelopeId},
                data:{status:EnvelopeStatus.COMPLETED},
            })
        }
    
        return{
            code:200,
            success:true,
            message:"Signed successfully",
            data:{recipient}
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Couldnt sign document"
        return{
            code:500,
            success:false,
            message:errorMessage,
            data:null
        }
    }
}