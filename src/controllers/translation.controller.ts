import { Request, Response } from 'express';
import axios from 'axios';
import { decode } from 'he';


export const translateText = async (req: Request, res: Response): Promise<any> => {
  // DEFINE ENCODED HTTP REQUEST PARAMETERS
  const params: any = {
    from: req.body.sourceLanguage,
    to: req.body.targetLanguage,
    text: req.body.textInput
  };

  // LOG PAYLOAD TO CONSOLE
  console.log(`translateText payload: ${ JSON.stringify(params) }`);

  // INITIALIZE ENCODED SEARCH PARAMETERS
  const encodedParams: URLSearchParams = new URLSearchParams(params);

  // CONFIGURE REQUEST OPTIONS
  const options = {
    method: 'POST',
    url: process.env.RAPIDAPI_API_GT,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY_GT,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST_GT
    },
    data: encodedParams
  };

  // SEND HTTP REQUEST AND RETURN RESPONSE
  // TODO: THIS IS FAILING IN PRODUCTION
  axios
    .request(options)
    .then((response: any): void => {
      const translatedText = response.data.trans;

      // DECODE HTML ENTITIES IN TEXT
      const decodedText: string = decode(translatedText);

      // SEND RESPONSE TO USER
      res.json(decodedText);
    })
    .catch((error: any): void => {
      console.error(error);
    });
}