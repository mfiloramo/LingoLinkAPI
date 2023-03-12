import { Request, Response } from 'express';
import axios from "axios";


export class GenericController {
    static async testMethod(req: Request, res: Response): Promise<any> {
        res.json('This controller is successfully sending a response!');
    }
}

export default GenericController;
