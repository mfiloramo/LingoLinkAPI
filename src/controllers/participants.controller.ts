import { Request, Response } from 'express';
import { wcCoreMSQLConnection } from "../config/database/wcCoreMSQLConnection";


export const selectAllParticipants = async (req: Request, res: Response): Promise<void> => {
  // SELECT ALL PARTICIPANTS
  try {
    const selectAll = await wcCoreMSQLConnection.query('EXECUTE usp_Participant_SelectAll')
    res.send(selectAll[0]);
  } catch (error: any) {
    res.status(500).send(error);
  }
}

export const selectParticipant = async (req: Request, res: Response): Promise<void> => {
  // HANDLE SELECTION BY CONVERSATION ID
  if (req.body.selector === 'conversationId') {
    const { conversationId } = req.body;
    try {
      const response = await wcCoreMSQLConnection.query('EXECUTE usp_Participant_Select_ConId :conversationId', {
        replacements: { conversationId }
      })
      res.send(response[0][0]);
    } catch (error: any) {
      res.status(500).send(error);
      console.error(error);
    }
    // HANDLE SELECTION BY CONVERSATION ID
  } else if (req.body.selector === 'userId') {
    try {
      const { userId } = req.body;
      const response = await wcCoreMSQLConnection.query('EXECUTE usp_Participant_Select_UserId :userId', {
        replacements: { userId }
      })
      res.send(response[0][0]);
    } catch (error: any) {
      res.status(500).send(error);
      console.error(error);
    }
  }
}

export const createNewParticipant = async (req: Request, res: Response): Promise<void> => {
  // CREATE NEW PARTICIPANT
  try {
    const { userId, conversationId } = req.body;

    await wcCoreMSQLConnection.query('EXECUTE usp_Participant_Create :userId, :conversationId', {
      replacements: { userId, conversationId }
    })
    res.send(`Participant with user_id ${ userId } created successfully`);
  } catch (error: any) {
    res.status(500).send(error);
    console.error(error);
  }
}

export const deleteParticipant = async (req: Request, res: Response): Promise<void> => {
  // DELETE EXISTING PARTICIPANT BY user_id AND conversationId
  try {
    const { userId, conversationId } = req.body;
    await wcCoreMSQLConnection.query('EXECUTE usp_Participant_Delete :userId, :conversationId', {
      replacements: { userId, conversationId }
    })
    res.json(`Participant with userId ${ req.body.userId } and conversationId ${ req.body.conversationId } deleted successfully`);
  } catch (error: any) {
    res.status(500).send(error);
    console.error(error);
  }
}