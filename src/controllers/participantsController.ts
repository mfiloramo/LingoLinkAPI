import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";

export const participantsController = async (req: Request, res: Response) => {
  switch (req.method) {
    // SELECT PARTICIPANT
    case 'GET':
      if (req.body.selector === 'conversationId') {
        // HANDLE SELECTION BY conversationId
        try {
          const response = await wcCoreMSQLConnection.query('EXECUTE usp_Participant_Select_ConId :conversationId', {
            replacements: {
              conversationId: req.body.conversationId
            }
          })
          res.send(response[0][0]);
        } catch (error: any) {
          console.log(error);
        }
      } else if (req.body.selector === 'userId') {
        // HANDLE SELECTION BY userId
        try {
          const response = await wcCoreMSQLConnection.query('EXECUTE usp_Participant_Select_UserId :userId', {
            replacements: {
              userId: req.body.userId
            }
          })
          res.send(response[0][0]);
        } catch (error: any) {
          console.log(error);
        }
      }
      break;

    // CREATE NEW PARTICIPANT
    case 'POST':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_Participant_Create :userId, :conversationId',  {
          replacements: {
            userId: req.body.userId,
            conversationId: req.body.conversationId,
          }
        })
        res.send(`Participant with userId ${req.body.userId} created successfully`);
      } catch (error: any) {
        console.log(error);
      }
      break;

    // UPDATE EXISTING PARTICIPANT
    case 'PUT':
      res.send('Cannot update participant(s)')
      break;

    // DELETE EXISTING PARTICIPANT BY userId AND conversationId
    case 'DELETE':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_Participant_Delete :userId, :conversationId', {
          replacements: {
            userId: req.body.userId,
            conversationId: req.body.conversationId,
          }
        })
        res.send(`Participant with userId ${req.body.userId} and conversationId ${req.body.conversationId} deleted successfully`);
      } catch (error: any) {
        console.log(error);
      }
      break;

    default:
      break;
  }
}

