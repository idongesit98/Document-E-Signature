import {Request,Response } from "express";
import { getAllUsers, loginUser, register } from "../services/authService/authService";

export const signUp = async (req:Request,res:Response) =>{
    const payload = req.body;
    const registerResponse = await register({
        firstname:payload.firstname,
        lastname:payload.lastname,
        email:payload.email,
        password:payload.password,
        role:payload.role
    })
    res.status(registerResponse.code).json(registerResponse)
};

export const login = async (req:Request,res:Response) => {
    try {
        const {email,password}= req.body;
        const loginResponse = await loginUser(email,password)
        res.status(loginResponse.code).json(loginResponse)
    } catch (error:any) {
        res.status(400).send({success:false,message:error.message})
    }
};

export const allUser = async (req:Request,res:Response) => {
    const allResponse = await getAllUsers()
    res.status(allResponse.code).json(allResponse)
}

