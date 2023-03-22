import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";


export const participantsController = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_User_Create :username, :email, :password', {
          replacements: {
            username: 'aaaaaaaa',
            email: 'f@teafaaaaaaaaast.com',
            password: 'fafaaaaaaaaaffff!'
          }
        })
      } catch (error: any) {
        console.log(error);
      }
      res.send('User Successfully Added');
      break;

    case 'POST':
      break;

    case 'PUT':
      break;

    case 'DELETE':
      break;

    default:
      break;
  }
}

