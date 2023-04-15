"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.msalNodeConfig = void 0;
const msal_node_1 = require("@azure/msal-node");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const AZ_CLIENT = process.env['AZ_CLIENT_API'];
const AZ_TENANT = process.env['AZ_TENANT'];
const AZ_SECRET_VAL = process.env['AZ_SECRET_VAL'];
if (!AZ_CLIENT || !AZ_TENANT || !AZ_SECRET_VAL) {
    throw new Error('AZ_CLIENT, AZ_TENANT, and AZ_CLIENT_SECRET must be defined in the environment variables.');
}
exports.msalNodeConfig = {
    auth: {
        clientId: AZ_CLIENT,
        authority: AZ_TENANT,
        clientSecret: AZ_SECRET_VAL,
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                if (containsPii) {
                    return;
                }
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal_node_1.LogLevel.Info,
        },
    },
};
