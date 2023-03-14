"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translationRouter = void 0;
const express_1 = __importDefault(require("express"));
const translation_controller_1 = __importDefault(require("../controllers/translation.controller"));
const router = express_1.default.Router();
router.post('/translate', translation_controller_1.default.translateText);
exports.translationRouter = router;
