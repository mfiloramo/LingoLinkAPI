import { Request, Response, NextFunction } from 'express';


export const conversationsController = async (req: Request, res: Response, next: NextFunction) => {
  res.send('success');
}

