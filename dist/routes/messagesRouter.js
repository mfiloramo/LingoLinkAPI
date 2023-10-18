"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRouter = void 0;
const express_1 = __importDefault(require("express"));
const messagesController_1 = require("../controllers/messagesController");
const router = express_1.default.Router();
router.get('/:id?', messagesController_1.messagesController);
router.post('/', messagesController_1.messagesController);
router.delete('/:id?', messagesController_1.messagesController);
router.put('/:id?', messagesController_1.messagesController);
exports.messagesRouter = router;
