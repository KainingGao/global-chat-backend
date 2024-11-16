"use strict";
//C:\Users\kygao\global-chat-backend\src\routes\user.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/profile', auth_1.authenticate, user_1.getProfile);
router.put('/location', auth_1.authenticate, user_1.updateLocation);
exports.default = router;
