import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";
import jwt from 'jsonwebtoken';


export const usersController = async (req: Request, res: Response): Promise<void> => {
  switch (req.method) {
    case 'GET':
      if (!req.body.userId && !req.query) {
        // SELECT ALL USERS
        try {
          const selectAll = await wcCoreMSQLConnection.query('EXECUTE usp_User_SelectAll')
          res.send(selectAll[0]); // TODO: CHANGE BACK TO ARRAY (REMOVE 1 [0])
        } catch (error: any) {
          res.status(500).send(error);
        }
      } else if (req.query) {
        // VALIDATE USER AGAINST DATABASE
        try {
          const response = await wcCoreMSQLConnection.query
          ('EXECUTE usp_User_Validate :email, :password', {
            replacements: {
              email: req.query.email,
              password: req.query.password
            }
          })
          res.send(response[0][0])
        } catch (error: any) {
          res.status(500).send(error);
          console.log(error);
        }
      }
        else {
          // SELECT USER BY ID
          try {
            const response = await wcCoreMSQLConnection.query('EXECUTE usp_User_Select :userId', {
              replacements: {
                userId: req.body.userId,
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
      if (req.body.token) {
        try {
          const decodedToken = jwt.decode(req.body.token) as any;
          const userId = decodedToken.oid;

          // SELECT USER BY ID
          const response = await wcCoreMSQLConnection.query('EXECUTE usp_User_Select :userId', {
            replacements: {
              userId,
            },
          });

          if (response[0][0]) {
            res.send({success: true, user: response[0][0]});
          } else {
            res.status(404).send({success: false, message: 'User not found'});
          }
        } catch (error: any) {
          res.status(500).send(error);
          console.log(error);
        }
      } else {
        try {
          await wcCoreMSQLConnection.query('EXECUTE usp_User_Create :username, :email, :password', {
            replacements: {
              username: req.body.username,
              email: req.body.email,
              password: req.body.password
            }
          })
          res.send(`User ${req.body.username} created successfully`);
        } catch (error: any) {
          res.status(500).send(error);
          console.log(error);
        }
      }
      break;

    // UPDATE EXISTING USER
    case 'PUT':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_User_Update :userId, :username, :email, :password', {
          replacements: {
            userId: req.body.userId,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
          }
        })
        res.json(`User ${req.body.username} updated successfully`);
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
            userId: req.body.userId,
          }
        })
        res.json(`User ${req.body.userId} deleted successfully`);
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
}