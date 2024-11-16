"use strict";
//C:\Users\kygao\global-chat-backend\src\routes\index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const chat_1 = __importDefault(require("./chat"));
const souvenir_1 = __importDefault(require("./souvenir"));
const setupRoutes = (app) => {
    app.use('/api/auth', auth_1.default);
    app.use('/api/users', user_1.default);
    app.use('/api/chats', chat_1.default);
    app.use('/api/souvenirs', souvenir_1.default);
};
exports.setupRoutes = setupRoutes;
