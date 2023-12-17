import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";
import bcrypt from 'bcrypt';

import * as dotenv from 'dotenv';
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
    const response: any = await wcCoreMSQLConnection.query('EXECUTE usp_User_Select :userId', {
      replacements: {
        userId: req.body.userId,
      }
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
    res.json(`User ${ req.body.username } created successfully, pending approval.`);
  } catch (error: any) {
    console.error("Error in user registration:", error);
    if (!res.headersSent) {
      res.status(500).send(error);
    }
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  // UPDATE EXISTING USER
  try {
    const { username, email, password } = req.body;
    await wcCoreMSQLConnection.query('EXECUTE usp_User_Update :userId, :username, :email, :password', {
      replacements: { userId: req.body.userId, username, email, password }
    })
    res.json(`User ${ req.body.username } updated successfully`);
  } catch (error: any) {
    res.status(500).send(error);
    console.error(error);
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  // DELETE EXISTING USER BY ID
  try {
    await wcCoreMSQLConnection.query('EXECUTE usp_User_Delete :userId', {
      replacements: {
        userId: req.body.userId,
      }
    })
    res.json(`User ${ req.body.userId } deleted successfully`);
  } catch (error: any) {
    res.status(500).send(error);
    console.error(error);
  }
}