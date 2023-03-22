import { Request, Response, NextFunction } from 'express';
import {wcCoreMSQLConnection} from "../config/database/wcCoreMSQLConnection";


export const conversationsController = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    // SELECT CONVERSATION BY ID
    case 'GET':
      try {
        const response = await wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Select :conversationId', {
          replacements: {
            conversationId: req.body.conversationId,
          }
        })
        res.send(response[0][0]);
      } catch (error: any) {
        console.log(error);
      }
      break;

    // CREATE NEW CONVERSATION
    case 'POST':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Create :name',  {
          replacements: {
            name: req.body.name,
          }
        })
        res.send(`Conversation with name ${req.body.name} created successfully`);
      } catch (error: any) {
        console.log(error);
      }
      break;

    // UPDATE EXISTING CONVERSATION
    case 'PUT':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Update :conversationId, :name', {
          replacements: {
            conversationId: req.body.conversationId,
            name: req.body.name,
          }
        })
        res.send(`Conversation ${req.body.name} updated successfully`);
      } catch (error: any) {
        console.log(error);
      }
      break;

    // DELETE EXISTING CONVERSATION BY ID
    case 'DELETE':
      try {
        await wcCoreMSQLConnection.query('EXECUTE usp_Message_Delete :conversationId', {
          replacements: {
            conversationId: req.body.conversationId,
          }
        })
        res.send(`Conversation ${req.body.conversationId} deleted successfully`);
      } catch (error: any) {
        console.log(error);
      }
      break;

    default:
      break;
  }}

