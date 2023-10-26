import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";

export const participantsController = async (req: Request, res: Response) => {
  switch (req.method) {
    // SELECT PARTICIPANT
    case 'GET':
      if (!req.body.selector) {
        // SELECT ALL PARTICIPANTS
        try {
          const selectAll = await wcCoreMSQLConnection.query('EXECUTE usp_Participant_SelectAll')
          res.send(selectAll[0]);
        } catch (error: any) {
          res.status(500).send(error);
        }
        // HANDLE SELECTION BY conversationId
        } else if (req.body.selector === 'conversationId') {
          try {
            const response = await wcCoreMSQLConnection.query('EXECUTE usp_Participant_Select_ConId :conversationId', {
              replacements: {
                conversationId: req.body.conversationId
              }
            })
            res.send(response[0][0]);
          } catch (error: any) {
            res.status(500).send(error);
            console.log(error);
          }
          // HANDLE SELECTION BY userId
        } else if (req.body.selector === 'user_id') {
          try {
            const response = await wcCoreMSQLConnection.query('EXECUTE usp_Participant_Select_UserId :userId', {
              replacements: {
                userId: req.body.user_id
              }
            })
            res.send(response[0][0]);
          } catch (error: any) {
            res.status(500).send(error);
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
        res.send(`Participant with user_id ${req.body.user_id} created successfully`);
      } catch (error: any) {
        res.status(500).send(error);
        console.log(error);
      }
      break;

    // UPDATE EXISTING PARTICIPANT
    case 'PUT':
      res.send('Cannot update participant(s)')
      break;

    // DELETE EXISTING PARTICIPANT BY user_id AND conversationId
    case 'DELETE':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_Participant_Delete :userId, :conversationId', {
          replacements: {
            userId: req.body.user_id,
            conversationId: req.body.conversationId,
          }
        })
        res.send(`Participant with userId ${req.body.userId} and conversationId ${req.body.conversationId} deleted successfully`);
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

