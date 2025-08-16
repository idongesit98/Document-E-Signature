import express from "express";
import dotenv from "dotenv";
import morgan from 'morgan';
import authRoutes from "./routes/authRoutes"
import envelopeRoutes from "./routes/envelopeRoute"
import docuRoutes from "./routes/docuRoutes"
import recipientRoutes from "./routes/recipientRoute"
import signRoutes from "./routes/signRoutes"
import auditRoutes from "./routes/auditRoutes"
import { connectRedis } from "./utils/config/redis";

dotenv.config();

const app = express()
connectRedis();

app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api/auth",authRoutes)
app.use("/api/envelopes",envelopeRoutes);
app.use("/api/document",docuRoutes);
app.use("/api/recipients",recipientRoutes)
app.use("/api/sign",signRoutes)
app.use("/api/history",auditRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`))