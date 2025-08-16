import { PrismaClient } from "@prisma/client";
import cloudinary from "../../utils/config/cloudinary";
import { redisClient } from "../../utils/config/redis";
const prisma = new PrismaClient();

// export const uploadDocument = async(fileBuffer:Buffer,folder:string = "docusign_clone") =>{
//     try {

//         const result = await cloudinary.uploader.upload_stream(
//             {resource_type: "raw",folder:folder,chunk_size:6_000_000});
            
//             console.log("Uploaded document: ",result)
//             async(error,result) => {
//                 if (error) return
//             }
        
//         return{
//             code:200,
//             success:true,
//             data:{
//                 url:result.secure_url,
//                 publicId:result.public_id,
//                 size:result.bytes,
//                 format:result.format,
//                 resourceType:result.resource_type as ResourceType
//             },
//             message:"File uploaded to Cloudinary successfully"
//         };
//     } catch (error:any) {
//         console.error("Upload Error:", error);
//         return {
//             success: false,
//             message: error?.message || "Failed to upload file",
//             error:error,
//         };
//     }
// }

export const saveFileToDB = async(options:SaveFileOptions) =>{
    const saveUploadedFile = prisma.document.create({
        data:{
            name:options.name,
            size:options.size,
            fileUrl:options.url,
            publicId:options.publicId,
            userId:options.userId,
            resourceType:options.resource_type,
            envelopeId:options.envelopeId || null
        }
    })
    return saveUploadedFile;
}

export const allUploaded = async() =>{
    try {
        const allUsers = await prisma.document.findMany({})
        
        if (allUsers.length === 0) {
            return{
                code:400,
                success:false,
                message:"Uploaded documents not found",
                data:null
            }
        }
        return{
            code:200,
            success:true,
            message:"Uploaded documents found",
            data:{
                documents:allUsers
            }
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failure to get all documents"
        return{
            code:500,
            success:false,
            message:errorMessage,
            data:null
        }
    }
}

export const getSignedDocument = async(userId:string,envelopeId:string,documentId:string,email:string) => {
    const envelope = await prisma.envelope.findUnique({
        where:{id:envelopeId},
        include:{
            recipients:true,
            uploader:true,
            documents:true
        },
    });

    if (!envelope) {
        return{
            code:404,
            success:false,
            message:"No envelope found",
            data:null
        }
    }

    const owner = envelope.uploaderId === userId;
    const isRecipient = envelope.recipients.some((r) => r.email === email)

    if (!owner && !isRecipient) {
        return{
            code:403,
            success:false,
            message:"Unauthorized to access this document",
            data:null
        }
    }

    if (envelope.status !== "COMPLETED") {
        return{
            code:403,
            success:false,
            message:"Documents are only available after completion",
            data:null
        }
    }

    const docs = envelope.documents.find((d) => d.id === documentId)

    if (!docs) {
        return{
            code:404,
            success:false,
            message:"Document not found",
            data:null
        }
    }
    return{
        code:200,
        success:true,
        message:"Document found",
        data:{downloadUrl:docs.fileUrl}
    }
}

export const moveDocument = async(documentId:string,envelopeId:string,userId:string) =>{
    if (!documentId || !envelopeId || !userId) {
        return{
            code:400,
            success:false,
            message:"Document,Envelope and User Id not found",
            data:null
        }
    }

    try {
        const updatedDocument = await prisma.document.update({
            where:{id:documentId},
            data:{envelopeId:envelopeId}
        })

        return{
            code:200,
            success:true,
            message:"Document moved to Envelope",
            data:{Document:updatedDocument}
        }
    } catch (error) {
         const errorMessage = (error instanceof Error) ? error.message : "Error moving Envelope"
         console.error(errorMessage)
        return{
            code:500,
            success:false,
            message:errorMessage
        }
    }
}

export const generateCloudinaryDownloadUrl = async(publicId:string,resourceType:ResourceType) =>{
    const cacheKey = `cloudinary:signed:${publicId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return{
            success:true,
            url:cached,
            fromCache:true
        };
    }

    try {
        const url = cloudinary.url(publicId,{
            resource_type:resourceType,
            secure:true,
            sign_url:true
        });
        await redisClient.setEx(cacheKey,300,url);

        return{
            success:true,
            url,
            fromCache:false,
        };
    } catch (error) {
        console.error("Cloudinary signed URL error:",error)
        return{
            success:false,
            message:error || "Failed to generate signed URL",
        };
    }
}

