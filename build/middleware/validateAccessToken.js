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
exports.validateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const msalNodeConfig_1 = require("../config/msalAuth/msalNodeConfig");
const jwksUri = `https://login.microsoftonline.com/${msalNodeConfig_1.msalNodeConfig.auth.authority}/discovery/keys`;
const client = (0, jwks_rsa_1.default)({
    jwksUri,
    cache: true,
});
function getKey(header, callback) {
    client.getSigningKey(header.kid, (error, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}
function validateAccessToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).send('Authorization header is missing');
            }
            const [bearer, token] = authHeader.split(' ');
            if (bearer !== 'Bearer' || !token) {
                return res.status(401).send('Authorization header has an incorrect format');
            }
            jsonwebtoken_1.default.verify(token, getKey, { audience: msalNodeConfig_1.msalNodeConfig.auth.clientId }, (err, decodedToken) => {
                if (err) {
                    console.log('Token validation failed:', err);
                    return res.status(401).send('Invalid access token');
                }
                req.user = decodedToken;
                next();
            });
        }
        catch (error) {
            console.log('error!');
            res.status(401).send('Invalid access token');
        }
    });
}
exports.validateAccessToken = validateAccessToken;
