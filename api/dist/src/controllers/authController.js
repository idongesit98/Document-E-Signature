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
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUser = exports.login = exports.signUp = void 0;
const authService_1 = require("../services/authService/authService");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const registerResponse = yield (0, authService_1.register)({
        firstname: payload.firstname,
        lastname: payload.lastname,
        email: payload.email,
        password: payload.password,
        role: payload.role
    });
    res.status(registerResponse.code).json(registerResponse);
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const loginResponse = yield (0, authService_1.loginUser)(email, password);
        res.status(loginResponse.code).json(loginResponse);
    }
    catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});
exports.login = login;
const allUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allResponse = yield (0, authService_1.getAllUsers)();
    res.status(allResponse.code).json(allResponse);
});
exports.allUser = allUser;
