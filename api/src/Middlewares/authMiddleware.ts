import { Request,Response,NextFunction } from "express";
import jwt,{JwtPayload} from 'jsonwebtoken';
import prisma from "../Utils/Config/database";

export const authMiddleware = async (req:Request,res:Response,next:NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        res.status(401).json(
            {message:'Access denied. No token provided.'}
        )
        return
    }
       
    try {
       const decoded = jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload;

       if (!decoded || typeof decoded === "string" || !decoded.id) {
            return res.status(401).json({message:"Invalid token"})
       }

       const user = await prisma.users.findUnique({where:{id:decoded.id}})
       if (!user) {
            return res.status(401).json({message:"User not found"});
       }

       (req as any).user = user;
       next();
    } catch (error) {
        res.status(401).json({message:"Invalid token."})
        return
    }
};