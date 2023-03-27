import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";


export const conversationsController = async (req: Request, res: Response) => {
  switch (req.method) {
    // SELECT CONVERSATION
    case 'GET':
      if (!req.body.conversationId) {
        // SELECT ALL CONVERSATIONS
        try {
          // const selectAll = await wcCoreMSQLConnection.query('EXECUTE usp_Conversation_SelectAll')
          console.log(req.params.id)
          const selectAll: any = await wcCoreMSQLConnection.query('EXECUTE usp_GetConversationsByUserId :userId',
            {
              replacements: {
                userId: req.params.id
              }
            }).catch((err: any) => console.log(err));
          res.json(selectAll[0])
        } catch (error: any) {
          res.status(500).send(error);
        }
      } else {
        // SELECT CONVERSATION BY ID
        try {
          const response = await wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Select :conversationId', {
            replacements: {
              conversationId: req.params.id
            }
          })
          res.send(response[0][0]);
        } catch (error: any) {
          res.status(500).send(error);
          console.log(error);
        }
      }
      break;

    // CREATE NEW CONVERSATION
    case 'POST':
      try {
        const conversationId: any = await wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Create :name',  {
          replacements: {
            name: req.body.name,
          }
        })
        res.send(conversationId[0][0]);
        // res.json(`Conversation with name ${req.body.name} created successfully`);
      } catch (error: any) {
        res.status(500).send(error);
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
        res.send(`Conversation ${req.body.conversationId} deleted successfully`);
      } catch (error: any) {
        res.status(500).send(error);
        console.log(error);
      }
      break;

    // THROW ERROR INDICATING INVALID REQUEST TYPE
    default:
      res.status(500).send('Please provide appropriate HTTP request type');
      break;
  }}

