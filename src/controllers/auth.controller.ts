import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { CourierClient, ICourierClient } from "@trycourier/courier";

import * as dotenv from 'dotenv';
dotenv.config();
// TODO: IMPLEMENT SERVER-SIDE SESSIONS; AUTO-LOGOUT FEATURE

export const validateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const email: string = req.query.email as string;
    const plaintextPassword: string = req.query.password as string;

    const userResult = await wcCoreMSQLConnection.query('EXECUTE usp_User_Validate :email', {
      replacements: { email }
    });

    // CHECK IF USER IS AVAILABLE
    if (userResult[0].length > 0) {
      const user: any = userResult[0][0];
      const { username, firstName, lastName, email, enabled, userId, defaultLanguage, profileImg } = user;
      const hashedPassword = user.password;

      // VERIFY PLAINTEXT PASSWORD AGAINST HASHED PASSWORD
      let isPasswordValid: boolean = await bcrypt.compare(plaintextPassword, hashedPassword);

      // CHECK IF CREDENTIALS ARE VALID
      if (user && isPasswordValid) {
        res.json({ username, firstName, lastName, email, enabled, userId, defaultLanguage, profileImg });
      } else {
        res.status(401).send('Invalid credentials');
      }
    } else {
      res.status(404).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const { email, newPassword } = req.body;

  // HASH PASSWORD
  const saltRounds: number = 10;
  const hashedPassword: string = await bcrypt.hash(newPassword, saltRounds);

  // CHANGE USER PASSWORD IN DATABASE
  try {
    await wcCoreMSQLConnection.query('EXECUTE usp_User_Update_Password :email, :hashedPassword', {
      replacements: { email, hashedPassword }
    });
  } catch (error: any) {
    res.status(500).send(error);
    console.error(error);
  }
}

export const sendUserRegNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userEmail: any = req.query.userEmail;

    // CHECK FOR VALID SECRET_REGISTRATION_KEY
    if (!process.env.SECRET_REGISTRATION_KEY) {
      throw new Error('SECRET_REGISTRATION_KEY is not set');
    }

    // ISSUE JSON WEB TOKEN
    const token: string = jwt.sign({ email: userEmail }, process.env.SECRET_REGISTRATION_KEY, { expiresIn: '1d' }
    );

    // SET ENVIRONMENT-SPECIFIC ENDPOINTS FOR RESPONDING TO USER REG. REQUEST
    const approveRegLink: string = `${ process.env.API_BASE_URL }/auth/approve/${ token }`;
    const declineRegLink: string = `${ process.env.API_BASE_URL }/auth/decline/${ token }`;

    // SEND EMAIL NOTIFICATION TO ADMIN
    const courier: ICourierClient = CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

    await courier.send({
      message: {
        to: { email: process.env.ADMIN_EMAIL },
        template: 'KDQ7KY5JG845W9QXJS8Z23ZHGRTW',
        data: {
          recipientName: process.env.ADMIN_EMAIL,
          userEmail,
          approveRegLink,
          declineRegLink
        },
      },
    })
      .then((response: any): void => {
        console.log('Email notification successfully sent with requestId of:', response.requestId)
        return;
      })
      .catch((error: any): void => {
        console.error(error)
        return;
      });

    // SEND EMAIL NOTIFICATION TO USER
    await courier.send({
      message: {
        to: { email: userEmail },
        template: 'BMWQMCFFBH4NMEN6HEFWG7BK56WJ',
      },
    })
      .then((response: any): void => {
        console.log('Email notification successfully sent with requestId of:', response.requestId)
      })
      .catch((error: any): void => {
        console.error(error)
      });
    res.json({ message: 'OK' });
    return;
  } catch (error: any) {
    console.error(error);
    return;
  }
}

export const approveUserRegistration = async (req: any, res: Response): Promise<void> => {
  try {
    // CHECK FOR SECRET_REGISTRATION_KEY
    if (!process.env.SECRET_REGISTRATION_KEY) {
      console.error('Error: SECRET_REGISTRATION_KEY not found.');
    }

    // VERIFY JSON WEB TOKEN
    const decoded: any = jwt.verify(req.params.token, process.env.SECRET_REGISTRATION_KEY!);
    const userEmail = decoded.email;

    // FIND USER'S ID BASED ON DECODED EMAIL
    const userResult: any = await wcCoreMSQLConnection.query('EXECUTE usp_User_Select :email', {
      replacements: { email: userEmail }
    });

    if (userResult[0].length > 0) {
      const userId: any = userResult[0][0].userId;

      // ENABLE USER ACCOUNT
      await wcCoreMSQLConnection.query('EXECUTE usp_User_Enable :userId', {
        replacements: { userId }
      });
      res.send('User successfully approved');

      // SEND EMAIL NOTIFICATION TO USER
      const courier: ICourierClient = CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

      await courier.send({
        message: {
          to: { email: userEmail },
          template: '5HVQKZMPVCMX9TQ30BEW1BPVMWAN',
        },
      })
        .then((response: any): void => {
          console.log('Email notification successfully sent with requestId of:', response.requestId);
          return;
        })
        .catch((error: any): void => {
          console.error(error)
          return;
        });
      return;
    } else {
      res.status(404).send('User not found');
    }
  } catch (error: any) {
    res.status(500).send(`Error approving user: ${ JSON.stringify(error) }`);
  }
}

export const declineUserRegistration = async (req: any, res: any): Promise<void> => {
  try {
    // CHECK FOR SECRET_REGISTRATION_KEY
    if (!process.env.SECRET_REGISTRATION_KEY) {
      console.error('Error: SECRET_REGISTRATION_KEY not found.');
    }

    // DECODE TOKEN
    const decoded: any = jwt.verify(req.params.token, process.env.SECRET_REGISTRATION_KEY!);
    const userEmail = decoded.email;

    // FIND USER'S ID BASED ON DECODED EMAIL
    const userResult: any = await wcCoreMSQLConnection.query('EXECUTE usp_User_Select :email', {
      replacements: { email: userEmail }
    });

    if (userResult[0].length > 0) {
      res.send('User successfully declined');

      // SEND EMAIL NOTIFICATION TO USER
      const courier: ICourierClient = CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

      await courier.send({
        message: {
          to: { email: userEmail },
          template: '4790REG5SDM7Y4GKRXFRRCMBG9X9',
        },
      })
        .then((response: any): void => {
          console.log('Email notification successfully sent with requestId of:', response.requestId);
        })
        .catch((error: any): void => {
          console.error(error)
        });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error: any) {
    res.status(500).send('Error declining user', error);
  }
}
