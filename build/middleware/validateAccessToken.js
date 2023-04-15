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
const msal_node_1 = require("@azure/msal-node");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const msalNodeConfig_1 = require("../config/msalAuth/msalNodeConfig");
const msalInstance = new msal_node_1.ConfidentialClientApplication(msalNodeConfig_1.msalNodeConfig);
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
            let decodedToken;
            try {
                decodedToken = jsonwebtoken_1.default.decode(token);
            }
            catch (error) {
                return res.status(401).send('Error decoding access token');
            }
            const validationParams = {
                clientId: msalNodeConfig_1.msalNodeConfig.auth.clientId,
                scopes: decodedToken.scopes.split(' '),
                authority: msalNodeConfig_1.msalNodeConfig.auth.authority,
            };
            yield msalInstance.acquireTokenOnBehalfOf({
                oboAssertion: token,
                scopes: validationParams.scopes,
                authority: validationParams.authority,
            });
            next();
        }
        catch (error) {
            res.status(401).send('Invalid access token');
        }
    });
}
exports.validateAccessToken = validateAccessToken;
