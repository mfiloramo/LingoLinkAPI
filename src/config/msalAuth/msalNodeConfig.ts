import { Configuration as NodeConfiguration, LogLevel } from '@azure/msal-node';
import * as dotenv from 'dotenv';

dotenv.config();

const AZ_CLIENT_API = process.env['AZ_CLIENT_API'];
const AZ_TENANT = process.env['AZ_TENANT'];
const AZ_SECRET_VAL = process.env['AZ_SECRET_VAL'];
const LOCAL_API_ID_URI = process.env['LOCAL_API_ID_URI'];
const PROD_API_ID_URI = process.env['PROD_API_ID_URI'];

// if (!AZ_TENANT || !AZ_SECRET_VAL || !LOCAL_API_ID_URI || !PROD_API_ID_URI) {
//   throw new Error('AZ_TENANT, AZ_CLIENT_SECRET, LOCAL_API_ID_URI, and PROD_API_ID_URI must be defined in the environment variables.');
// }

function getApiIdUri() {
  if (process.env.NODE_ENV === 'production') {
    return PROD_API_ID_URI;
  } else {
    return LOCAL_API_ID_URI;
  }
}

const API_ID_URI = getApiIdUri();

export const msalNodeConfig: NodeConfiguration = {
  auth: {
    clientId: AZ_CLIENT_API!,
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

export { API_ID_URI };