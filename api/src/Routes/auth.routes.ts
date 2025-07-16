import {Router} from "express";
import { register,login } from "../Controllers/authController";
import { authMiddleware } from "../Middlewares/authMiddleware";

const router = Router();

router.post("/register",register);
router.post("/login",login)

export default router;