import { Request, Response, NextFunction } from 'express';


export const participantsController = async (req: Request, res: Response, next: NextFunction) => {
  res.send('success');
}

