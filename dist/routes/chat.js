"use strict";
//C:\Users\kygao\global-chat-backend\src\routes\chat.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const chat_1 = require("../controllers/chat");
const router = express_1.default.Router();
router.post('/', auth_1.authenticate, [
    (0, express_validator_1.body)('participantId').exists().isString(),
], validate_1.validateRequest, chat_1.createChat);
router.get('/', auth_1.authenticate, chat_1.getUserChats);
router.get('/:chatId', auth_1.authenticate, chat_1.getChat);
exports.default = router;
