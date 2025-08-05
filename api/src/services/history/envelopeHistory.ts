import prisma from "../../utils/config/database";

export const logAction = async({envelopeId,action}:{envelopeId:string,action:string}) =>{
    try {
        const audit = await prisma.auditTrail.create({
            data:{
                envelopeId,
                action
            }
        });
        return{
            code:200,
            success:true,
            message:"Action logged successfully",
            data:{
                audit
            }
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

export const getAuditTrail = async(envelopeId:string) =>{
    try {
        const getAll = await prisma.auditTrail.findMany({
            where:{envelopeId},
            orderBy:{timeStamp:"asc"}
        });

        if (getAll.length === 0) {
            return{
                code:404,
                success:false,
                message:"Couldn't find history",
                data:null
            }
        }
        return{
            code:200,
            success:false,
            message:"Trails found",
            data:{
                trails:getAll
            }
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "No history"
        return{
            code:500,
            success:false,
            message:errorMessage,
            data:null
        }
    }
}