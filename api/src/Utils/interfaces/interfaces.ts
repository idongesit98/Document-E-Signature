type ResourceType = "image" | "video" | "auto" | "raw" ;

interface SaveFileOptions{
    name:string;
    size:number;
    url?:string;
    publicId:string;
    resource_type: ResourceType
    userId:string;
    envelopeId?:string;
}
