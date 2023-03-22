"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const router = express_1.default.Router();
router.get('/:id?', usersController_1.usersController);
router.post('/', usersController_1.usersController);
router.delete('/:id?', usersController_1.usersController);
router.put('/:id?', usersController_1.usersController);
exports.usersRouter = router;
