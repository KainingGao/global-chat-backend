"use strict";
//C:\Users\kygao\global-chat-backend\src\routes\auth.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
router.post('/register', [
    (0, express_validator_1.body)('username').trim().isLength({ min: 3 }),
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('location').isObject()
], validate_1.validateRequest, auth_1.register);
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').exists()
], validate_1.validateRequest, auth_1.login);
router.post('/logout', auth_1.logout);
exports.default = router;
