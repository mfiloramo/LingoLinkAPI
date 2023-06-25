import { Request, Response } from 'express';
import axios from 'axios';
import 'dotenv';


export class TranslationController {
    public static async translateText(req: Request, res: Response): Promise<any> {
        // DEFINE ENCODED HTTP REQUEST PARAMETERS
        const params = {
            q: req.body.content,
            target: req.body.targLang,
            source: req.body.source_language
        };

        const encodedParams = new URLSearchParams(params);

        // CONFIGURE REQUEST OPTIONS
        const options = {
            method: 'POST',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY_GT,
                'X-RapidAPI-Host': process.env.RAPIDAPI_HOST_GT
            },
            data: encodedParams
        };

        // SEND HTTP REQUEST AND RETURN RESPONSE
        axios
          .request(options)
          .then((response: any) => {
              res.json(response.data.data.translations[0].translatedText);
          })
          .catch((error: any) => {
              console.error(error);
          });
    }
}

export default TranslationController;