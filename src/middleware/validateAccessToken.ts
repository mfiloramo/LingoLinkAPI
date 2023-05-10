import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { msalNodeConfig, API_ID_URI } from "../config/msalAuth/msalNodeConfig";

const jwksUri = `https://login.microsoftonline.com/${msalNodeConfig.auth.authority}/discovery/keys`;

const client = jwksClient({
  jwksUri,
  cache: true,
});

function getKey(header: any, callback: (arg0: null, arg1: any) => void) {
  client.getSigningKey(header.kid, (error: any, key: any) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export async function validateAccessToken(req: any, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send('Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).send('Authorization header has an incorrect format');
    }

    jwt.verify(token, getKey, { audience: 'api://lingolink-api' },(err: any, decodedToken: any) => {
      if (err) {
        console.log('Token validation failed:', err);
        return res.status(401).send('Invalid access token');
      }

      req.user = decodedToken;
      next();
    });

  } catch (error) {
    console.log('error!');
    res.status(401).send('Invalid access token');
  }
}