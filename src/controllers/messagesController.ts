import { Request, Response, NextFunction } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";


export const messagesController = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    // SELECT MESSAGE
    case 'GET':
      if (!req.params.id) {
        // SELECT ALL MESSAGES
        try {
          const selectAll = await wcCoreMSQLConnection.query('EXECUTE usp_Message_SelectAll')
          res.send(selectAll[0]);
        } catch (error: any) {
          res.status(500).send(error);
        }
      } else {
        // SELECT MESSAGE BY CONVERSATION ID
        try {
          const response = await wcCoreMSQLConnection.query('EXECUTE usp_Message_Select :conversationId', {
            replacements: {
              conversationId: req.params.id
            }
          })
          res.json(response[0]);
        } catch (error: any) {
          res.status(500).send(error);
          console.log(error);
        }
      }
      break;

    // CREATE NEW MESSAGE
    case 'POST':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_Message_Create :conversationId, :userId, :content, :timestamp',  {
          replacements: {
            conversationId: req.body.conversationId,
            userId: req.body.userId,
            content: req.body.content,
            timestamp: new Date().toISOString()
          }
        })
        res.json(`Message with conversationId ${req.body.conversationId} created successfully`);
      } catch (error: any) {
        res.status(500).send(error);
        console.log(error);
      }
      break;

    // UPDATE EXISTING MESSAGE
    case 'PUT':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_Message_Update :messageId, :content, :timestamp', {
          replacements: {
            messageId: req.body.messageId,
            content: req.body.content,
            timestamp: new Date(),
          }
        })
        res.send(`Message ${req.body.messageId} updated successfully`);
      } catch (error: any) {
        res.status(500).send(error);
        console.log(error);
      }
      break;

    // DELETE EXISTING MESSAGE BY MESSAGE ID
    case 'DELETE':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_Message_Delete :messageId', {
          replacements: {
            messageId: req.body.messageId,
          }
        })
        res.send(`Message ${req.body.messageId} deleted successfully`);
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

