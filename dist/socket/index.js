"use strict";
//C:\Users\kygao\global-chat-backend\src\socket\index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const Chat_1 = require("../models/Chat");
const setupSocketHandlers = (io) => {
    // Middleware for socket authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                throw new Error('Authentication error');
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await User_1.UserModel.findById(decoded.userId);
            if (!user) {
                throw new Error('User not found');
            }
            socket.userId = decoded.userId;
            next();
        }
        catch (error) {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.userId}`);
        // Update user's online status
        if (socket.userId) {
            await User_1.UserModel.findByIdAndUpdate(socket.userId, {
                lastOnline: new Date()
            });
        }
        // Handle broadcasting message
        socket.on('broadcast', async (data) => {
            const user = await User_1.UserModel.findById(socket.userId);
            if (user) {
                io.emit('newBroadcast', {
                    userId: socket.userId,
                    message: data.message.substring(0, 10), // First 10 characters
                    location: user.location
                });
            }
        });
        // Handle private chat
        socket.on('joinChat', async (chatId) => {
            socket.join(`chat:${chatId}`);
        });
        socket.on('sendMessage', async (data) => {
            if (!socket.userId)
                return;
            try {
                const chat = await Chat_1.ChatModel.findById(data.chatId);
                if (!chat || !chat.participants.includes(socket.userId)) {
                    return;
                }
                const message = {
                    senderId: socket.userId,
                    content: data.content,
                    timestamp: new Date()
                };
                chat.messages.push(message);
                await chat.save();
                io.to(`chat:${data.chatId}`).emit('newMessage', message);
            }
            catch (error) {
                console.error('Error sending message:', error);
            }
        });
        socket.on('disconnect', async () => {
            if (socket.userId) {
                await User_1.UserModel.findByIdAndUpdate(socket.userId, {
                    lastOnline: new Date()
                });
            }
            console.log(`User disconnected: ${socket.userId}`);
        });
    });
};
exports.setupSocketHandlers = setupSocketHandlers;
