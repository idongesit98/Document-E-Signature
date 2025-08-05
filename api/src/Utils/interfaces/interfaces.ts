type ResourceType = "image" | "video" | "raw";

interface SaveFileOptions{
    name:string;
    size:number;
    url?:string;
    publicId:string;
    resourceType: ResourceType
    userId:string;
    envelopeId?:string;
}
