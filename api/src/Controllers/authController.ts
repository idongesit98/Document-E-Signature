import {Request,Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import passport from "passport";
import prisma from "../Config/databases";

export const register = async (req:Request,res:Response) =>{
    const {email,password,name} = req.body;

    try {
        const existing = await prisma.user.findUnique({where:{email}})
        if(existing) {
            res.status(400).json({message:"User already exists"})
            return
        }
        const hashedPassword = await bcrypt.hash(password,10);
        
        const user = await prisma.user.create({
            data:{
                email,
                password:hashedPassword,
                name
            }
        });

        res.status(201).json(
            {
                message:"User registered", 
                user:{
                    id:user.id,
                    email:user.email,
                    name:user.name
                }
            });
    } catch (error:unknown) {
        const errorMessage = (error instanceof Error) ? error.message : "Error creating user"
        res.status(500).json({message:errorMessage})
    }
};

export const login = (req:Request,res:Response,next:any) => {
    passport.authenticate("local", {session:false},(err: any,user: { id: any; email: any; name: any; },info: { message: any; }) => {
        if (err || !user) {
            return res.status(401).json({message:info?.message || "Login failed"});
        }

        const token = jwt.sign({id:user.id},process.env.JWT_SECRET!,{
            expiresIn:"7d",
        });

        res.json({
            message:"Login successfull",
            token,
            user:{
                id:user.email,
                name:user.name
            },
        });
    })(req,res,next)
};

