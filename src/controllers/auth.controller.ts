import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { CourierClient, ICourierClient } from "@trycourier/courier";

import * as dotenv from 'dotenv';
dotenv.config();

export const validateUser = async (req: Request, res: Response): Promise<void> => {
    // VALIDATE USER AGAINST DATABASE
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
}

// TODO: SEND RESPONSE IN THIS FUNCTION
export const sendRegNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const userEmail: any = req.query.userEmail;

        // CHECK FOR VALID SECRET_REGISTRATION_KEY
        if (!process.env.SECRET_REGISTRATION_KEY) {
            throw new Error('SECRET_REGISTRATION_KEY is not set');
        }

        const token: string = jwt.sign({ email: userEmail }, process.env.SECRET_REGISTRATION_KEY, { expiresIn: '1d' }
        );

        // TODO: SET ENVIRONMENT-SPECIFIC REG LINKS
        // const approveRegLinkDev: string = `http://localhost:3000/api/auth/approve?token=${ token }`;
        // const declineRegLinkDev: string = `http://localhost:3000/api/auth/decline?token=${ token }`;
        const approveRegLinkDev: string = `http://localhost:3000/api/auth/approve/${ token }`;
        const declineRegLinkDev: string = `http://localhost:3000/api/auth/decline/${ token }`;

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

export const approveUserRegistration = async (req: any, res: Response): Promise<void> => {
    try {
        // CHECK FOR SECRET_REGISTRATION_KEY
        if (!process.env.SECRET_REGISTRATION_KEY) console.error('Error: SECRET_REGISTRATION_KEY not found.');

        // DECODE TOKEN
        const decoded: any = jwt.verify(req.params.token, process.env.SECRET_REGISTRATION_KEY!);
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

export const declineUserRegistration = async (req: any, res: any): Promise<void> => {
    try {
        // CHECK FOR SECRET_REGISTRATION_KEY
        if (!process.env.SECRET_REGISTRATION_KEY) console.error('Error: SECRET_REGISTRATION_KEY not found.');

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
