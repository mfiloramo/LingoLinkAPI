"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericRouter = void 0;
const express_1 = __importDefault(require("express"));
const generic_controller_1 = __importDefault(require("../controllers/generic.controller"));
const router = express_1.default.Router();
router.post('/translate', generic_controller_1.default.testMethod);
exports.genericRouter = router;
