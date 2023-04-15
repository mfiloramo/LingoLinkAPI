import { Configuration as BrowserConfiguration } from '@azure/msal-browser';
import { Configuration as NodeConfiguration, LogLevel } from '@azure/msal-node';
import * as dotenv from 'dotenv';

dotenv.config();

const AZ_CLIENT = process.env['AZ_CLIENT_API'];
const AZ_TENANT = process.env['AZ_TENANT'];
const AZ_SECRET_VAL = process.env['AZ_SECRET_VAL'];

if (!AZ_CLIENT || !AZ_TENANT || !AZ_SECRET_VAL) {
  throw new Error('AZ_CLIENT, AZ_TENANT, and AZ_CLIENT_SECRET must be defined in the environment variables.');
}

export const msalNodeConfig: NodeConfiguration = {
  auth: {
    clientId: AZ_CLIENT,
    authority: AZ_TENANT,
    clientSecret: AZ_SECRET_VAL,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel: any, message: string, containsPii: boolean) {
        if (containsPii) {
          return;
        }
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Info,
    },
  },
};