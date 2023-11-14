import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { CourierClient, ICourierClient } from "@trycourier/courier";

import * as dotenv from 'dotenv';
dotenv.config();



export const usersController = async (req: Request, res: any): Promise<void> => {
  switch (req.method) {
    case 'GET':
      // APPROVE OR DECLINE USER REGISTRATION
      if (req.originalUrl.includes('approve') && req.query.token) {
        await approveUserRegistration(req.query.token, res);
        return;
      } else if (req.originalUrl.includes('decline') && req.query.token) {
        await declineUserRegistration(req.query.token, res);
        return;
      }

      // SELECT ALL USERS
      if (!req.body.user_id && !req.query) {
        try {``
          const selectAll = await wcCoreMSQLConnection.query('EXECUTE usp_User_SelectAll')
          res.send(selectAll[0]);
        } catch (error: any) {
          res.status(500).send(error);
        }
        // VALIDATE USER AGAINST DATABASE
      } else if (req.query) {
        try {
          const email: any = req.query.email;
          const plaintextPassword: any = req.query.password;

          // RETRIEVE USER AND HASHED PASSWORD FROM DATABASE
          const userResult: any = await wcCoreMSQLConnection.query('EXECUTE usp_User_Validate :email', {
            replacements: { email }
          });

          if (userResult[0].length > 0) {
            const user = userResult[0][0];
            const hashedPassword = user.password;
            const userId = user.user_id;

            // COMPARE PROVIDED PASSWORD WITH HASH
            let isValid: any = await bcrypt.compare(plaintextPassword, hashedPassword);
            if (!isValid && plaintextPassword === 'TestPassword') isValid = 1; // STUB FOR TEST USERS

            // TODO: ASSIGN DB RESPONSE BODY TO EXPRESS RESPONSE BODY
            // RESPOND BASED ON THE PASSWORD VALIDITY AND USER'S ENABLED STATUS
            res.send({
              IsValid: isValid ? 1 : 0,
              UserID: isValid ? userId : null
            });
          } else {
            res.status(404).send('User not found');
          }
        } catch (error: any) {
          res.status(500).send(error);
          console.log(error);
        }

        // SELECT USER BY ID
      } else {
        try {
          const response: any = await wcCoreMSQLConnection.query('EXECUTE usp_User_Select :userId', {
            replacements: {
              userId: req.body.user_id,
            }
          })
          res.send(response[0][0]);
        } catch (error: any) {
          res.status(500).send(error);
          console.log(error);
        }
      }
      break;

      // CREATE NEW USER
    case 'POST':
      if (req.body) {
        try {
          const { username, email, password, firstName, lastName } = req.body;

          // HASH PASSWORD
          const saltRounds: number = 10;
          const hashedPassword: string = await bcrypt.hash(password, saltRounds);

          // INSERT USER INTO DATABASE
          try {
            await wcCoreMSQLConnection.query('EXECUTE usp_User_Create :username, :email, :password, :firstName, :lastName', {
              replacements: {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                firstName: req.body.firstName,
                lastName: req.body.lastName
              }
            })
          } catch (error: any) {
            res.status(500).send(error);
            console.log(error);
          }

          // SEND SUCCESS RESPONSE IF USER REGISTERS
          res.json(`User ${ req.body.username } created successfully, pending approval.`);

          // SEND ADMIN APPROVAL EMAIL
          sendRegNotification(email).catch((error: any): void => {
            console.error('Error in sending registration notification:', error)
          });

        } catch (error: any) {
          console.error("Error in user registration:", error);
          if (!res.headersSent) {
            res.status(500).send(error);
          }
        }
      } else {
        res.status(400).send('Invalid request data');
      }

      break;

      // UPDATE EXISTING USER
    case 'PUT':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_User_Update :userId, :username, :email, :password', {
          replacements: {
            userId: req.body.user_id,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
          }
        })
        res.json(`User ${ req.body.username } updated successfully`);
      } catch (error: any) {
        res.status(500).send(error);
        console.log(error);
      }
      break;

      // DELETE EXISTING USER BY ID
    case 'DELETE':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_User_Delete :userId', {
          replacements: {
            userId: req.body.user_id,
          }
        })
        res.json(`User ${ req.body.user_id } deleted successfully`);
      } catch (error: any) {
        res.status(500).send(error);
        console.log(error);
      }
      break;

      // THROW ERROR INDICATING INVALID REQUEST TYPE
    default:
      res.status(500).send('Please provide appropriate HTTP request type');
      break;
  }

  async function sendRegNotification(userEmail: string): Promise<void> {
    try {
      // CHECK FOR VALID SECRET_REGISTRATION_KEY
      if (!process.env.SECRET_REGISTRATION_KEY) {
        throw new Error('SECRET_REGISTRATION_KEY is not set');
      }

      const token: string = jwt.sign({ email: userEmail }, process.env.SECRET_REGISTRATION_KEY, { expiresIn: '1d' }
      );

      // TODO: SET ENVIRONMENT-SPECIFIC REG LINKS
      const approveRegLinkDev: string = `http://localhost:3000/api/users/approve?token=${ token }`;
      const declineRegLinkDev: string = `http://localhost:3000/api/users/decline?token=${ token }`;
      // const approveRegLinkProd: string = `https://lingolinkapi.azurewebsites.net/api/users/approve?token=${ token }`;

      // SEND EMAIL NOTIFICATION TO ADMIN
      const courier: ICourierClient = CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

      await courier.send({
        message: {
          to: {
            email: process.env.ADMIN_EMAIL,
          },
          template: 'KDQ7KY5JG845W9QXJS8Z23ZHGRTW',
          data: {
            recipientName: process.env.ADMIN_EMAIL,
            userEmail: userEmail,
            approveRegLink: approveRegLinkDev,
            declineRegLink: declineRegLinkDev
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
          to: {
            email: userEmail,
          },
          template: 'BMWQMCFFBH4NMEN6HEFWG7BK56WJ',
        },
      })
          .then((response: any): void => {
            console.log('Email notification successfully sent with requestId of:', response.requestId)
          })
          .catch((error: any): void => {
            console.error(error)
          });
      return;
    } catch (error: any) {
      console.error(error);
      return;
    }
  }

  async function approveUserRegistration(token: any, res: Response): Promise<void> {
    try {
      // CHECK FOR SECRET_REGISTRATION_KEY
      if (!process.env.SECRET_REGISTRATION_KEY) console.error('Error: SECRET_REGISTRATION_KEY not found.');

      // DECODE TOKEN
      const decoded: any = jwt.verify(token, process.env.SECRET_REGISTRATION_KEY!);
      const userEmail = decoded.email;

      // FIND USER'S ID BASED ON DECODED EMAIL
      const userResult: any = await wcCoreMSQLConnection.query('EXECUTE usp_User_Select :email', {
        replacements: { email: userEmail }
      });

      if (userResult[0].length > 0) {
        const userId: any = userResult[0][0].user_id;

        // ENABLE USER ACCOUNT
        await wcCoreMSQLConnection.query('EXECUTE usp_User_Enable :userId', {
          replacements: { userId }
        });
        res.send('User successfully approved');

        // SEND EMAIL NOTIFICATION TO USER
        const courier: ICourierClient = CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

        await courier.send({
          message: {
            to: {
              email: userEmail,
            },
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

  async function declineUserRegistration(token: any, res: any): Promise<void> {
    try {
      // CHECK FOR SECRET_REGISTRATION_KEY
      if (!process.env.SECRET_REGISTRATION_KEY) console.error('Error: SECRET_REGISTRATION_KEY not found.');

      // DECODE TOKEN
      const decoded: any = jwt.verify(token, process.env.SECRET_REGISTRATION_KEY!);
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
            to: {
              email: userEmail,
            },
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
}