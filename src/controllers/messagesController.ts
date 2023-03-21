import { Request, Response, NextFunction } from 'express';


export const messagesController = async (req: Request, res: Response, next: NextFunction) => {
  res.send('success');
}

