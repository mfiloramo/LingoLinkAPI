import { Request, Response, NextFunction } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";


export const messagesController = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    // SELECT MESSAGE BY ID
    case 'GET':
      try {
        const response = await wcCoreMSQLConnection.query('EXECUTE usp_Message_Select :conversationId, :limit, :offset', {
          replacements: {
            conversationId: req.body.conversationId,
            limit: req.body.limit,
            offset: req.body.offset
          }
        })
        res.send(response[0][0]);
      } catch (error: any) {
        console.log(error);
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
            timestamp: new Date()
          }
        })
        res.send(`Message with conversationId ${req.body.conversationId} created successfully`);
      } catch (error: any) {
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
        console.log(error);
      }
      break;

    // DELETE EXISTING MESSAGE BY ID
    case 'DELETE':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_Message_Delete :messageId', {
          replacements: {
            messageId: req.body.messageId,
          }
        })
        res.send(`Message ${req.body.messageId} deleted successfully`);
      } catch (error: any) {
        console.log(error);
      }
      break;

    default:
      break;
  }
}

