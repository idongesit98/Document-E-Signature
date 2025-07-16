"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const databases_1 = __importDefault(require("../Config/databases"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    try {
        const existing = yield databases_1.default.user.findUnique({ where: { email } });
        if (existing) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield databases_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });
        res.status(201).json({
            message: "User registered",
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error creating user";
        res.status(500).json({ message: errorMessage });
    }
});
exports.register = register;
const login = (req, res, next) => {
    passport_1.default.authenticate("local", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ message: (info === null || info === void 0 ? void 0 : info.message) || "Login failed" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.json({
            message: "Login successfull",
            token,
            user: {
                id: user.email,
                name: user.name
            },
        });
    })(req, res, next);
};
exports.login = login;
