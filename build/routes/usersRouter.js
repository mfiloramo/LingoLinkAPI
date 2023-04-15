"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const validateAccessToken_1 = require("../middleware/validateAccessToken");
const router = express_1.default.Router();
router.get('/:id?', validateAccessToken_1.validateAccessToken, usersController_1.usersController);
router.post('/', validateAccessToken_1.validateAccessToken, usersController_1.usersController);
router.delete('/:id?', validateAccessToken_1.validateAccessToken, usersController_1.usersController);
router.put('/:id?', validateAccessToken_1.validateAccessToken, usersController_1.usersController);
exports.usersRouter = router;
