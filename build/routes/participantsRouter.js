"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.participantsRouter = void 0;
const express_1 = __importDefault(require("express"));
const participantsController_1 = require("../controllers/participantsController");
const router = express_1.default.Router();
router.get('/:id?', participantsController_1.participantsController);
router.post('/', participantsController_1.participantsController);
router.delete('/:id?', participantsController_1.participantsController);
router.put('/:id?', participantsController_1.participantsController);
exports.participantsRouter = router;
