import {Request,Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import passport from "passport";
import prisma from "../Config/databases";
import speakeasy from "speakeasy"
import { redisClient } from "../Utils/OTP/otp";
import { transporter } from "../Utils/OTP/otp";

type UserParams = {
    name:string;
    email:string;
    password:string,
    otp:string,
    documents:string,
    signature:string
}

export const register = async ({name,email,password}:UserParams) =>{
    try {
        const existing = await prisma.user.findUnique({where:{email}})
        if (existing) {
            return{
                code:400,
                success:false,
                message:"User already exist",
                data:null
            }
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await prisma.user.create({
            data:{ 
                name,
                email,
                password:hashedPassword
            }
        })

        const {password:_p, ...userWithoutPassword} = newUser;
        return{
            code:201,
            success:true,
            message:'User signed up successfully',
            data:{
                user:userWithoutPassword
            }
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error creating user"
        return{
            code:500,
            success:false,
            data:null,
            message:errorMessage
        }
    }
}

export const sendOtpToUser = async (email:string,password:string) => {
}

export const verifyOTP = async ({email,otp}:UserParams) => {
    const storedOTP = await redisClient.get(`OTP:${email}`)
    const user = await prisma.user.findUnique({where:{email}})

    if (storedOTP || storedOTP !== otp) {
        return{
            code:401,
            success:false,
            message:"Invalid or Expired OTP",
        };
    }

    //Verify OTP then delete from redis after a while
    await redisClient.del(`OTP:${email}`)

     //Generate JWT token
     const token = jwt.sign({id:user?.id,email:user?.email},
        process.env.JWT_SECRET!,{expiresIn:"1d"}
     );

     return{
        code:200,
        success:true,
        data:{user,token},
        message:"OTP verified. Login successful."
     };
}

export const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany({})

        if (!users) {
            return{
                code:404,
                success:false,
                message:"No user available",
                data:null
            }
        }

        return{
            code:200,
            success:true,
            message:"User available",
            data:{users}
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error creating user"
        return{
            code:500,
            success:false,
            message:errorMessage
        }
    }
}

// export const updateUser = async ({name,role,}) => {
    
// }