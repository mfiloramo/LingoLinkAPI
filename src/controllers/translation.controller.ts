import { Request, Response } from 'express';
import axios from 'axios';
import { decode } from 'he';


export const translateText = async (req: Request, res: Response): Promise<any> => {
  // DEFINE ENCODED HTTP REQUEST PARAMETERS
  const params: any = {
    q: req.body.textInput,
    target: req.body.targetLanguage,
    source: req.body.sourceLanguage
  };

  // LOG PAYLOAD TO CONSOLE
  console.log(`translateText invoked with payload: ${ JSON.stringify(params) }`);

  const encodedParams: URLSearchParams = new URLSearchParams(params);

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
    .then((response: any): void => {
      const translatedText = response.data.data.translations[0].translatedText;

      // DECODE HTML ENTITIES IN TEXT
      const decodedText: string = decode(translatedText);

      res.json(decodedText);
    })
    .catch((error: any): void => {
      console.error(error);
    });
}