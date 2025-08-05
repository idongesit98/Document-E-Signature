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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.loginUser = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../../utils/config/database"));
const client_1 = require("@prisma/client");
const register = (_a) => __awaiter(void 0, [_a], void 0, function* ({ firstname, lastname, email, password, role }) {
    try {
        const existing = yield database_1.default.users.findUnique({ where: { email } });
        if (existing) {
            return {
                code: 400,
                success: false,
                message: "User already exist",
                data: null
            };
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const normalizedRole = Object.values(client_1.UserRole).includes(role)
            ? role : client_1.UserRole.USER;
        const newUser = yield database_1.default.users.create({
            data: {
                firstname,
                lastname,
                email,
                password: hashedPassword,
                role: normalizedRole
            }
        });
        const { password: _p } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
        return {
            code: 201,
            success: true,
            message: 'User signed up successfully',
            data: {
                user: userWithoutPassword
            }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error creating user";
        return {
            code: 500,
            success: false,
            data: null,
            message: errorMessage
        };
    }
});
exports.register = register;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield database_1.default.users.findUnique({ where: { email } });
        if (!user) {
            return {
                code: 403,
                success: false,
                message: "No email found",
                data: null
            };
        }
        const correctPassword = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        const { password: _password } = user, userWithoutPassword = __rest(user, ["password"]);
        if (!correctPassword) {
            return {
                code: 401,
                success: false,
                message: "Invalid Credentials",
                data: null
            };
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log("User token", token);
        return {
            code: 200,
            success: true,
            message: "User signed in successfully",
            data: {
                user: userWithoutPassword,
                token: token
            }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error logging user";
        return {
            code: 500,
            success: false,
            data: null,
            message: errorMessage
        };
    }
});
exports.loginUser = loginUser;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield database_1.default.users.findMany({});
        if (!users.length) {
            return {
                code: 404,
                success: false,
                message: "No user available",
                data: null
            };
        }
        return {
            code: 200,
            success: true,
            message: "User available",
            data: { users }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error creating user";
        return {
            code: 500,
            success: false,
            message: errorMessage
        };
    }
});
exports.getAllUsers = getAllUsers;
