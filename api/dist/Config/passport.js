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
const databases_1 = __importDefault(require("./databases"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
//Local Strategy
passport_1.default.use('local', new passport_local_1.Strategy({ usernameField: 'email' }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield databases_1.default.user.findUnique({ where: { email } });
        if (!user)
            return done(null, false, { message: 'Incorrect email or password' });
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return done(null, false, { message: "Incorrect email or password" });
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
//JWT Strategy
passport_1.default.use('jwt', new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield databases_1.default.user.findUnique({ where: { id: jwtPayload.id } });
        if (!user)
            return done(null, false);
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield databases_1.default.user.findUnique({ where: { id } });
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
exports.default = passport_1.default;
