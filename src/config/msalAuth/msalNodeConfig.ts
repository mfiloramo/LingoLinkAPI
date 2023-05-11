import { LogLevel } from '@azure/msal-node';
import * as dotenv from 'dotenv';

dotenv.config();

const AZ_TENANT = process.env['AZ_TENANT'];
const AZ_CLIENT_API = process.env['AZ_CLIENT_API'];
const AZ_SECRET_API = process.env['AZ_SECRET_API'];
const LOCAL_API_ID_URI = process.env['CLIENT_API_DEV'];
const PROD_API_ID_URI = process.env['CLIENT_API_PROD'];

// if (!AZ_TENANT || !AZ_SECRET_VAL) {
//   throw new Error('AZ_TENANT, AZ_CLIENT_SECRET, LOCAL_API_ID_URI, and PROD_API_ID_URI must be defined in the environment variables.');
// }

function getApiIdUri() {
  if (process.env.NODE_ENV === 'production') {
    console.log('tomato');
    return PROD_API_ID_URI;
  } else {
    return LOCAL_API_ID_URI;
  }
}

const API_ID_URI = getApiIdUri();

export const msalNodeConfig: any = {
  auth: {
    clientId: AZ_CLIENT_API,
    clientSecret: AZ_SECRET_API,
    authority: `https://login.microsoftonline.com/${AZ_TENANT}`,
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