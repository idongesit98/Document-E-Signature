import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../../utils/config/database";
import { UserRole } from "@prisma/client";

type UserParams = {
    firstname:string;
    lastname:string;
    email:string;
    password:string,
    role:string
}

export const register = async ({firstname,lastname,email,password,role}:UserParams) =>{
    try {
        const existing = await prisma.users.findUnique({where:{email}})
        if (existing) {
            return{
                code:400,
                success:false,
                message:"User already exist",
                data:null
            }
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const normalizedRole = Object.values(UserRole).includes(role as UserRole) 
            ? (role as UserRole) : UserRole.USER;

        const newUser = await prisma.users.create({
            data:{ 
                firstname,
                lastname,
                email,
                password:hashedPassword,
                role:normalizedRole
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

export const loginUser = async (email:string,password:string) => {
    try {
        const user = await prisma.users.findUnique({where:{email}});

        if (!user) {
            return{
                code:403,
                success:false,
                message:"No email found",
                data:null
            }
        }

        const correctPassword = await bcrypt.compare(password,user?.password)
        const {password: _password,...userWithoutPassword} = user
        if (!correctPassword) {
            return{
                code:401,
                success:false,
                message:"Invalid Credentials",
                data:null
            };
        }

        const token = jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET!,{expiresIn:'7d'});
        console.log("User token",token);

        return{
            code:200,
            success:true,
            message:"User signed in successfully",
            data:{
                user:userWithoutPassword,
                token:token
            }
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error logging user"
        return{
            code:500,
            success:false,
            data:null,
            message:errorMessage
        }
    }
}


export const getAllUsers = async () => {
    try {
        const users = await prisma.users.findMany({})

        if (!users.length) {
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