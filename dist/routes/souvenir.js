"use strict";
//C:\Users\kygao\global-chat-backend\src\routes\souvenir.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const souvenir_1 = require("../controllers/souvenir");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
router.post('/draw', auth_1.authenticate, souvenir_1.drawSouvenir);
router.post('/exchange', auth_1.authenticate, [
    (0, express_validator_1.body)('souvenirId').exists(),
    (0, express_validator_1.body)('receiverId').exists(),
    (0, express_validator_1.body)('chatId').exists()
], validate_1.validateRequest, souvenir_1.exchangeSouvenir);
exports.default = router;
