"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationsRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/:id?', conversationsController.cconversationsController);
router.post('/', conversationsController.cconversationsController);
router.delete('/:id?', conversationsController.cconversationsController);
router.put('/:id?', conversationsController.cconversationsController);
exports.conversationsRouter = router;
