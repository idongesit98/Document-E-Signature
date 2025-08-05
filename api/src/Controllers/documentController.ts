import { Request,Response } from "express";
import { uploadDocument,allUploaded, saveFileToDB } from "../services/docuService/documentService";


export const uploadFile = async(req:Request,res:Response) =>{
    if (!req.file) {
        res.status(400).json({success:false,message:"No file uploaded"})
        return;
    }
    console.log(req.file)

    const filePath = req.file.path;
    console.log(filePath)
    const uploadResponse = await uploadDocument(filePath);

    if (!uploadResponse.success || !uploadResponse.data) {
        res.status(500).json({
            success:false,
            message:uploadResponse.message || "Upload failed",
            error:uploadResponse.error
        });
        return;
    }

    const {url,publicId,size,resourceType} = uploadResponse.data
    const savedFile = await saveFileToDB({
        name:req.file.originalname,
        size,
        url,
        publicId,
        resourceType,
        userId:req.user!.id,
        envelopeId:req.body.envelopeId
    })
    res.status(200).json({success:true,data:savedFile});
    return;
}

export const getAllUploaded = async(req:Request,res:Response) =>{
    const allResponse = await allUploaded()
    res.status(allResponse.code).json(allResponse)
}