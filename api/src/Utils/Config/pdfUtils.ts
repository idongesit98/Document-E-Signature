import { PDFDocument,rgb,StandardFonts } from "pdf-lib";
import cloudinary from "./cloudinary";
import streamifier from "streamifier";

export const embedSignatureToPdf = async(publicId:string,signatureText:string,signatureType:string,signatureImageUrl?:string) =>{
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
    console.log(cloud_name)

    const pdfBuffer = await fetch(`https://res.cloudinary.com/${cloud_name}/raw/upload/${publicId}.pdf`)
                        .then(res => res.arrayBuffer());
    
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const firstPage = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

   if (signatureType === "TYPED") {
     firstPage.drawText(signatureText, {
         x:150,
         y:100,
         size:24,
         font,
         color:rgb(0,0,0)
     });
   }else if (signatureType === "DRAWN" && signatureImageUrl) {
        const imgBytes = await fetch(signatureImageUrl).then(res => res.arrayBuffer());
        const pngImage = await pdfDoc.embedPng(imgBytes);
        firstPage.drawImage(pngImage, {
            x:100,
            y:150,
            width:200,
            height:80         
        });
   }
   const signedPdfBytes = await pdfDoc.save();
   
   const uploadedStream = cloudinary.uploader.upload_stream(
        {
            resource_type: "raw", 
            folder: "signed_pdfs", 
            format: "pdf" 
        },
        async(error,result) =>{
            if (error) {
                return{
                    code:400,
                    success:false,
                    message:error.message,
                    data:null
                }
            }
            return{
                code:200,
                success:true,
                message:"Uploaded successfully",
                data:{result}
            }
        }
   );
   streamifier.createReadStream(Buffer.from(signedPdfBytes)).pipe(uploadedStream);
}