import { PrismaClient } from "@prisma/client";
import cloudinary from "../../utils/config/cloudinary";
import { options } from "joi";

const prisma = new PrismaClient();

export const uploadDocument = async(filePath:string,folder:string = "docusign_clone") =>{
    try {
            const result = await cloudinary.uploader.upload(filePath,{
                resource_type:"auto",
                folder,
            });
            console.log("Uploaded document: ",result)
        
            return{
                code:200,
                success:true,
                data:{
                    url:result.secure_url,
                    publicId:result.public_id,
                    size:result.bytes,
                    format:result.format,
                    resourceType:result.resource_type as ResourceType
                },
                message:"File uploaded to Cloudinary successfully"
            };
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error occured while uploading file"
        return{
            code:500,
            success:false,
            error:errorMessage,
            data:null
        }
    }
}

export const saveFileToDB = async(options:SaveFileOptions) =>{
    const saveUploadedFile = prisma.document.create({
        data:{
            name:options.name,
            size:options.size,
            fileUrl:options.url,
            publicId:options.publicId,
            userId:options.userId,
            resourceType:options.resourceType,
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

