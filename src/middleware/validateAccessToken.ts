import { Request, Response, NextFunction } from 'express';
import { ConfidentialClientApplication } from '@azure/msal-node';
import jwt from 'jsonwebtoken';
import { msalNodeConfig } from "../config/msalAuth/msalNodeConfig";
const msalInstance = new ConfidentialClientApplication(msalNodeConfig);

export async function validateAccessToken(req: Request, res: Response, next: NextFunction) {
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
      decodedToken = jwt.decode(token) as any;
    } catch (error) {
      return res.status(401).send('Error decoding access token');
    }

    const validationParams = {
      clientId: msalNodeConfig.auth.clientId,
      scopes: decodedToken.scopes.split(' '),
      authority: msalNodeConfig.auth.authority,
    };

    await msalInstance.acquireTokenOnBehalfOf({
      oboAssertion: token,
      scopes: validationParams.scopes,
      authority: validationParams.authority,
    });

    next();
  } catch (error) {
    res.status(401).send('Invalid access token');
  }
}