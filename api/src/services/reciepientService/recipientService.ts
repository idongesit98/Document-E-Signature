import { ReceipientRole } from "@prisma/client";
import prisma from "../../utils/config/database";
import { date } from "joi";

export const addRecipientEnvelope = async(envelopeId:string,email:string,role:ReceipientRole) =>{
    try {
        const createRecipient = await prisma.recipient.create({
            data:{
                envelopeId,
                email,
                role
            }
        })
        return{
            code:201,
            success:true,
            message:"Recipient created successfully",
            data:{
                recipient:createRecipient
            }
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error creating recipient"
        return{
            code:500,
            success:false,
            error:errorMessage,
            data:null,
        }
    }
}

export const listRecipientForEnvelope = async(envelopeId:string) =>{
   try {
     const findList = await prisma.recipient.findMany({
         where:{envelopeId},
         orderBy:{createdAt:"asc"},
         include:{envelope:true}
     })

     if (findList.length === 0) {
        return{
            code:404,
            success:false,
            message:"Recipients List found",
            data:{list:findList}
        }
     }

     return{
        code:200,
        success:true,
        message:"List found",
        data:{
            list:{findList}
        }
     }
   } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "No list"
        return{
            code:500,
            success:false,
            message:"Couldnt create list",
            error:errorMessage
        }
   }
}