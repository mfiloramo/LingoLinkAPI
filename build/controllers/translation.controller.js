"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationController = void 0;
const axios_1 = __importDefault(require("axios"));
class TranslationController {
    static translateText(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    'X-RapidAPI-Key': 'ecf66d69d6mshe72310107b57165p10bd22jsn5245b15bf146',
                    'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
                },
                data: encodedParams
            };
            // SEND HTTP REQUEST AND RETURN RESPONSE
            axios_1.default
                .request(options)
                .then((response) => {
                res.json(response.data.data.translations[0].translatedText);
            })
                .catch((error) => {
                console.error(error);
            });
        });
    }
}
exports.TranslationController = TranslationController;
exports.default = TranslationController;
