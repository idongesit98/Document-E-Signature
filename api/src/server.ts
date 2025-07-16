import express from "express";
import dotenv from "dotenv";
import passport from "./Config/passport";
import authRoutes from "./Routes/auth.routes"

dotenv.config();

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(passport.initialize());


app.use("/api/auth",authRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`))