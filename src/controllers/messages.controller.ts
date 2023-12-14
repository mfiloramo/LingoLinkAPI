import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";


export const selectAllMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    // SELECT ALL MESSAGES
    const selectAll = await wcCoreMSQLConnection.query('EXECUTE usp_Message_SelectAll')
    res.send(selectAll[0]);
  } catch (error: any) {
    res.status(500).send(error);
  }
}
export const selectMessagesByConversationId = async (req: Request, res: Response): Promise<void> => {
  // SELECT MESSAGES BY CONVERSATION ID
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

export const createNewMessage = async (req: Request, res: Response): Promise<void> => {
  // CREATE NEW MESSAGE
  try {
    await wcCoreMSQLConnection.query('EXECUTE usp_Message_Create :conversationId, :userId, :content, :srcLang, :timestamp', {
      replacements: {
        conversationId: req.body.conversationId,
        userId: req.body.userId,
        content: req.body.textInput,
        srcLang: req.body.sourceLanguage,
        timestamp: new Date().toISOString()
      }
    })
    res.json(`Message with conversationId ${ req.body.conversationId } created successfully`);
  } catch (error: any) {
    res.status(500).send(error);
    console.log(error);
  }
}
export const updateExistingMessage = async (req: Request, res: Response): Promise<void> => {
  // UPDATE EXISTING MESSAGE
  try {
    await wcCoreMSQLConnection.query('EXECUTE usp_Message_Update :messageId, :content, :srcLang, :timestamp', {
      replacements: {
        messageId: req.body.messageId,
        content: req.body.textInput,
        srcLang: req.body.srcLang,
        timestamp: new Date().toISOString(),
      }
    })
    res.json(`Message ${req.body.messageId} updated successfully`);
  } catch (error: any) {
    res.status(500).send(error);
    console.log(error);
  }}
export const deleteExistingMessage = async (req: Request, res: Response): Promise<void> => {
  // DELETE EXISTING MESSAGE BY MESSAGE ID
  try {
    await wcCoreMSQLConnection.query('EXECUTE usp_Message_Delete :messageId', {
      replacements: {
        messageId: req.body.messageId,
      }
    })
    res.json(`Message ${ req.body.messageId } deleted successfully`);
  } catch (error: any) {
    res.status(500).send(error);
    console.log(error);
  }
}