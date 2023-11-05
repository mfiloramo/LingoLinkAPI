import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";


export const conversationsController = async (req: Request, res: Response): Promise<void> => {
  switch (req.method) {
    // SELECT CONVERSATION
    case 'GET':
      if (req.query.id) {

        // SELECT CONVERSATIONS BY USER ID
        try {
          const response: any = await wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Metadata :userId', {
            replacements: {
              userId: req.query.id
            }
          })
          res.send(response[0]);
        } catch (error: any) {
          res.status(500).send(error);
          console.log(error);
        }
      }
      break;

    // CREATE NEW CONVERSATION
    case 'POST':
      try {
        const conversationId: any = await wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Start :recipientEmail, :conversationName, :sourceLanguage, :senderUserId, :timestamp',  {
          replacements: {
            recipientEmail: req.body.recipientEmail,
            conversationName: req.body.conversationName,
            sourceLanguage: req.body.sourceLanguage,
            senderUserId: req.body.senderUserId,
            timestamp: null
          }
        })
        // RETURN NEW CONVERSATION ID
        res.json(conversationId[0][0]);
      } catch (error: any) {
        res.status(500).send(error);
        console.log(error);
      }
      break;

    // UPDATE EXISTING CONVERSATION BY ID
    case 'PUT':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Update :conversationId, :name', {
          replacements: {
            conversationId: req.body.conversationId,
            name: req.body.name,
          }
        })
        res.json(`Conversation ${ req.body.name } updated successfully`);
      } catch (error: any) {
        res.status(500).send(error);
        console.log(error);
      }
      break;

    // DELETE EXISTING CONVERSATION BY ID
    case 'DELETE':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Delete :conversationId', {
          replacements: {
            conversationId: req.body.conversationId,
          }
        })
        res.json(`Conversation ${ req.body.conversationId } deleted successfully`);
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