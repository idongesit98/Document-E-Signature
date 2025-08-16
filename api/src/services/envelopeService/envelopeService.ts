import { EnvelopeStatus, ReceipientRole } from "@prisma/client";
import prisma from "../../utils/config/database";
import { logAction } from "../history/envelopeHistory";

// export const createEnvelope = async(userId:string,title:string,description:string) =>{
//     try {
//         const existing = await prisma.envelope.findUnique({where:{title:title}})
        
//         if (existing) {
//             return{
//                 code:400,
//                 success:false,
//                 message:"Envelope already exists",
//                 data:null
//             }
//         }
//         const newEnvelope = await prisma.envelope.create({
//             data:{
//                 title,
//                 uploaderId:userId,
//                 description
//             }
//         })
//         await logAction({ envelopeId: userId, action: "Envelope sent" });

//         return{
//             code:201,
//             success:true,
//             message:"Envelope created successfully",
//             data:{newEnvelope}
//         }    
//     } catch (error) {
//        const errorMessage = (error instanceof Error) ? error.message : "Error creating envelope"
//         return{
//             code:500,
//             success:false,
//             message:errorMessage
//         }
//     }
// }
export const createEnvelope = async(userId:string,title:string,description:string,recipients:{email:string;role:ReceipientRole}[],documents:{name:string;size:number;publicId:string;fileUrl:string;resourceType:string}[]) =>{
    try {
        const existing = await prisma.envelope.findUnique({where:{title}});

        if (existing) {
            return{
                code:400,
                success:false,
                message:"Envelope already exists",
                data:null
            };
        }
        const newEnvelope = await prisma.envelope.create({
            data:{
                title,
                description,
                uploaderId:userId,
                status:"DRAFT",
                recipients:{create:recipients},
                documents:{
                    create:documents.map(doc => ({
                        name:doc.name, 
                        size:doc.size,
                        publicId:doc.publicId,
                        fileUrl:doc.fileUrl,
                        resourceType:doc.resourceType,
                        userId
                    }))
                }
            },
            include:{recipients:true,documents:true}
        });
        await logAction({envelopeId:newEnvelope.id,action:"Envelope created"});
        return{
            code:201,
            success:true,
            message:"Envelope created successfully",
            data:newEnvelope
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error creating envelope"
        return{
            code:500,
            success:false,
            message:errorMessage
        };
    }
}
export const getEnvelopeById = async (envelopeId:string) => {
    try {
        const getEnvelopeById = await prisma.envelope.findUnique({
            where:{id:envelopeId},
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
            data:{Envelope:getEnvelopeById}
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
            where:{uploaderId:userId},
            include:{
                recipients:true,
                uploader:true,
                documents:true
            },
            orderBy:{createdAt:"desc"}
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
            data:{AllEnvelopes:getAllEnvelopes}
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

export const sendEnvelope = async (envelopeId:string) => {
   try {
     const sending = await prisma.envelope.update({
         where:{id:envelopeId},
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

