import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";
import bcrypt from 'bcrypt';

import * as dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { CourierClient, ICourierClient } from "@trycourier/courier";
dotenv.config();


export const selectAllUsers = async (req: Request, res: Response): Promise<void> => {
  // SELECT ALL USERS
  try {
    const selectAll = await wcCoreMSQLConnection.query('EXECUTE usp_User_SelectAll')
    res.send(selectAll[0]);
  } catch (error: any) {
    res.status(500).send(error);
  }
}

export const selectUser = async (req: Request, res: Response): Promise<void> => {
  // SELECT USER BY ID
  try {
    const { userId } = req.body;
    const response: any = await wcCoreMSQLConnection.query('EXECUTE usp_User_Select :userId', {
      replacements: { userId }
    })
    res.send(response[0][0]);
  } catch (error: any) {
    res.status(500).send(error);
    console.error(error);
  }
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
  // CREATE NEW USER
  try {
    const { username, email, password, firstName, lastName, profileImg } = req.body;

    // HASH PASSWORD
    const saltRounds: number = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    // INSERT USER INTO DATABASE
    try {
      await wcCoreMSQLConnection.query('EXECUTE usp_User_Create :username, :email, :password, :firstName, :lastName, :profileImg', {
        replacements: { username, email, password: hashedPassword, firstName, lastName, profileImg }
      })
    } catch (error: any) {
      res.status(500).send(error);
      console.error(error);
    }

    // SEND SUCCESS RESPONSE IF USER REGISTERS
    res.json(`User ${ username } created successfully, pending approval.`);
  } catch (error: any) {
    console.error("Error in user registration:", error);
    if (!res.headersSent) {
      res.status(500).send(error);
    }
  }
}

export const updateUsername = async (req: Request, res: Response): Promise<void> => {
  // UPDATE EXISTING USERNAME BY USERID
  try {
    const { userId, username } = req.body;
    await wcCoreMSQLConnection.query('EXECUTE usp_User_Update_Username :userId, :username', {
      replacements: { userId, username }
    })
    res.json(`User ${ username } updated successfully`);
  } catch (error: any) {
    res.status(500).send(error);
    console.error(error);
  }
}

export const updateName = async (req: Request, res: Response): Promise<void> => {
  // UPDATE EXISTING NAME BY USERID
  try {
    const { userId, firstName, lastName } = req.body;
    const formattedName: string = firstName.charAt(0).toUpperCase() + firstName.slice(1) + ' ' + lastName.charAt(0).toUpperCase() + lastName.slice(1);

    await wcCoreMSQLConnection.query('EXECUTE usp_User_Update_Name :userId, :firstName, :lastName', {
      replacements: { userId, firstName, lastName }
    })
    res.json(`User ${ formattedName } updated successfully`);
  } catch (error: any) {
    res.status(500).send(error);
    console.error(error);
  }
}

export const updateEmail = async (req: Request, res: Response): Promise<void> => {
  // UPDATE EXISTING EMAIL BY USER ID
  try {
    const { token, userId } = req.params;

    // VERIFY JSON WEB TOKEN
    const decoded: any = jwt.verify(token, process.env.SECRET_REGISTRATION_KEY!);

    // FIND USER'S ID BASED ON DECODED EMAIL
    const userResult: any = await wcCoreMSQLConnection.query('EXECUTE usp_User_Select_UserId :userId', {
      replacements: { userId }
    });

    // CHANGE USER EMAIL IN DATABASE
    if (userResult[0].length > 0) {
      await wcCoreMSQLConnection.query('EXECUTE usp_User_Update_Email :userId, :email', {
        replacements: { userId, email: decoded.email }
      })
      res.json(`User ${ decoded.email } updated successfully`);
    }
  } catch (error: any) {
    res.status(500).send(error);
    console.error(error);
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  // DELETE EXISTING USER BY ID
  try {
    const { userId } = req.body;
    await wcCoreMSQLConnection.query('EXECUTE usp_User_Delete :userId', {
      replacements: { userId }
    })
    res.json(`User ${ userId } deleted successfully`);
  } catch (error: any) {
    res.status(500).send(error);
    console.error(error);
  }
}

export const emailUpdateConfirmation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, email } = req.body

    // CHECK FOR VALID SECRET_REGISTRATION_KEY
    if (!process.env.SECRET_REGISTRATION_KEY) {
      throw new Error('SECRET_REGISTRATION_KEY is not set');
    }

    // ISSUE JSON WEB TOKEN
    const token: string = jwt.sign({ email }, process.env.SECRET_REGISTRATION_KEY, { expiresIn: '1d' }
    );

    // SET ENVIRONMENT-SPECIFIC ENDPOINTS FOR RESPONDING TO USER REG. REQUEST
    const confirmEmailLink: string = `${ process.env.API_BASE_URL }/users/update-email/${ token }/${ userId }`;

    // SEND CONFIRMATION EMAIL TO USER
    const courier: ICourierClient = CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN })

    await courier.send({
      message: {
        to: { email },
        template: 'Q65TS74CKXMXTAPQ3E1PY8RN64ZY',
        data: { confirmEmailLink }
      }
    })
      .then((response: any): void => {
        console.log('Email notification successfully sent with requestId of:', response.requestId)
        // SEND SUCCESS RESPONSE
        res.json(`Email confirmation to ${ email } sent successfully`);
        return;
      })
      .catch((error: any): void => {
        console.error(error)
        return;
      });
  } catch (error: any) {
    res.status(500).send(error);
    console.error(error);
  }
}
