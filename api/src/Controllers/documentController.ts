import { Request,Response } from "express";
import {allUploaded, saveFileToDB, getSignedDocument, moveDocument, generateCloudinaryDownloadUrl } from "../services/docuService/documentService";
import cloudinary from "../utils/config/cloudinary";
import streamifier from "streamifier";
import prisma from "../utils/config/database";

// export const uploadFile = async(req:Request,res:Response) =>{
//     try {
//         if (!req.file) {
//             res.status(400).json({success:false,message:"No file uploaded"})
//             return;
//         }
//         console.log("Requested file",req.file)
    
//         const filePath = req.file.buffer;
//         console.log("File path",filePath)
//         const uploadResponse = await uploadDocument(filePath);
    
//         if (!uploadResponse.success || !uploadResponse.data) {
//         //    res.status(500).json({
//         //         success: false,
//         //         message: uploadResponse.message || "Upload failed",
//         //         error: uploadResponse.error?.error?.message || uploadResponse.error?.message || uploadResponse.error
//         //     });
//         //     return;
//             res.status(500).json({success:false,error:uploadResponse.error})
//             return;
//         }
    
//         const {url,publicId,size,resourceType} = uploadResponse.data
//         const savedFile = await saveFileToDB({
//             name:req.file.originalname,
//             size,
//             url,
//             publicId,
//             resourceType,
//             userId:req.user!.id,
//             envelopeId:req.body.envelopeId
//         })
//         res.status(200).json({success:true,data:savedFile});
//         return;
//     } catch (error:any) {
//        console.error("Controller Upload Error:", JSON.stringify(error, null, 2));
//         res.status(500).json({
//             success: false,
//             message: error?.message || "Unexpected server error"
//         });
//         return
//     }
// }

export const uploadPdf = async(req:Request,res:Response) => {
    try {
        if (!req.file) {
            res.status(400).json({message:"No file uploaded"});
            return;
        }

        const uploadedPdf = cloudinary.uploader.upload_stream(
            {
                resource_type:"raw",
                folder:"pdfs",
                format:"pdf"
            },
            async (error,result) =>{
                if (error) {
                    console.error("Error uploading PDF:",error);
                    res.status(500).json({message:"Failed to upload PDF."});
                    return;
                }
                const savedFile = await saveFileToDB({
                    name:req.file!.originalname,
                    size:result!.bytes,
                    url:result!.secure_url,
                    resource_type:result!.resource_type,
                    userId:req.user!.id,
                    envelopeId:req.body.envelopeId,
                    publicId:result!.public_id
                })
                res.status(200).json({
                    message:"PDF uploaded successfully!",
                   data:{savedFile}
                });
            }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadedPdf);
        
    } catch (error) {
        console.error('Error uploading PDF:', error);
        res.status(500).json({ message: 'Failed to upload PDF.' });
    }
}
export const getAllUploaded = async(req:Request,res:Response) =>{
    const allResponse = await allUploaded()
    res.status(allResponse.code).json(allResponse)
}

export const downloadSignedDocument = async(req:Request,res:Response)  =>{
    try {
        const {envelopeId,documentId} = req.params;
        const userId = req.user!.id;
        const email = req.user!.email

        const fileUrl = await getSignedDocument(userId,envelopeId,documentId,email)
        res.status(fileUrl.code).json({success:true,message:"Download Url available",data:fileUrl})
    } catch (error:any) {
        res.status(403).json({error:error.message})
    }
}

export const moveToEnvelope = async(req:Request,res:Response) =>{
    try {
        const {documentId,envelopeId} = req.body
        const userId = req.user!.id;

        if (!documentId || !envelopeId) {
            res.status(400).json({success:false,message:"Document and Envelope ID not found"})
            return
        }
        const documentResponse = await moveDocument(documentId,envelopeId,userId)
        res.status(documentResponse.code).json(documentResponse)
    } catch (error) {
        console.error(error)
        res.status(500).json({success:false,message:error})
    }
}

export const downloadFileFromCloud = async(req:Request,res:Response) =>{
    try {
        const encodedId = req.params.publicId;
        const publicId = decodeURIComponent(encodedId).trim();

        if (!publicId) {
            res.status(400).json({success:false,message:"Missing PublicId"})
            return;
        }

        const file = await prisma.document.findFirst({
            where:{publicId},
        })
        console.log("File returned:", file)

        if (!file) {
            res.status(400).json({success:false,message:"File not found"});
            return;
        }

        const result = await generateCloudinaryDownloadUrl(publicId,file.resourceType as "raw");
        if (!result.success) {
            res.status(500).json(result.message)
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ success: false, message: "Server error", error });  
        return;  
    }
}