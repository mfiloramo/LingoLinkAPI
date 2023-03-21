import { Request, Response, NextFunction } from 'express';


export const usersController = async (req: Request, res: Response, next: NextFunction) => {
  res.send('success');
}

