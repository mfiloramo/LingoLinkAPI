"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationsRouter = void 0;
const express_1 = __importDefault(require("express"));
const conversationsController_1 = require("../controllers/conversationsController");
const router = express_1.default.Router();
router.get('/:id?', conversationsController_1.conversationsController);
router.post('/', conversationsController_1.conversationsController);
router.delete('/:id?', conversationsController_1.conversationsController);
router.put('/:id?', conversationsController_1.conversationsController);
exports.conversationsRouter = router;
