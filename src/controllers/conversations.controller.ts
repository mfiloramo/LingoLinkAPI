import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";


export const selectAllConversations = async (req: Request, res: Response): Promise<any> => {
  // SELECT CONVERSATIONS BY USER ID
  try {
    const response: any = await wcCoreMSQLConnection.query('EXECUTE usp_Conversation_SelectAll');
    res.send(response[0]);
  } catch (error: any) {
    res.status(500).send(error);
    console.log(error);
  }
}

export const selectConversationsByUserId = async (req: Request, res: Response): Promise<any> => {
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

export const createConversation = async (req: Request, res: Response): Promise<any> => {
  // CREATE NEW CONVERSATION
  try {
    const conversationId: any = await wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Start :recipientEmail, :conversationName, :sourceLanguage, :senderUserId, :timestamp',  {
      replacements: {
        recipientEmail: req.body.recipientEmail,
        conversationName: req.body.conversationName,
        sourceLanguage: req.body.sourceLanguage,
        senderUserId: req.body.senderUserId,
        timestamp: req.body.timestamp
      }
    })
    // RETURN NEW CONVERSATION ID
    res.json(conversationId[0][0]);
  } catch (error: any) {
    res.status(500).send(error);
    console.log(error);
  }
}

export const updateConversation = async (req: Request, res: Response): Promise<any> => {
  // UPDATE EXISTING CONVERSATION BY ID
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
}

export const deleteConversation = async (req: Request, res: Response): Promise<any> => {
  // DELETE EXISTING CONVERSATION BY ID
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
}