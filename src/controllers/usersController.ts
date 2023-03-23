import { Request, Response, NextFunction } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";


export const usersController = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    case 'GET':
      if (!req.params.id) {
        // SELECT ALL USERS
        try {
          const selectAll = await wcCoreMSQLConnection.query('EXECUTE usp_User_SelectAll')
          res.send(selectAll[0]);
        } catch (error: any) {
          res.status(500).send(error);
        }
      } else {
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
        res.send(`User ${req.body.username} updated successfully`);
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
        res.send(`User ${req.body.userId} deleted successfully`);
      } catch (error: any) {
        res.status(500).send(error);
        console.log(error);
      }
      break;

    default:
      res.status(500).send('Please provide appropriate HTTP request type');
      break;
  }
}

