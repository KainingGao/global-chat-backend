"use strict";
//C:\Users\kygao\global-chat-backend\src\controllers\chat.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserChats = exports.getChat = exports.createChat = void 0;
const Chat_1 = require("../models/Chat");
const User_1 = require("../models/User");
const createChat = async (req, res) => {
    try {
        const { participantId } = req.body;
        const userId = req.user._id;
        // Check if chat already exists between these users
        const existingChat = await Chat_1.ChatModel.findOne({
            participants: {
                $all: [userId, participantId],
                $size: 2
            }
        });
        if (existingChat) {
            return res.json(existingChat);
        }
        // Verify participant exists
        const participant = await User_1.UserModel.findById(participantId);
        if (!participant) {
            return res.status(404).json({ error: 'Participant not found' });
        }
        const chat = new Chat_1.ChatModel({
            participants: [userId, participantId],
            messages: [],
            souvenirExchanged: false
        });
        await chat.save();
        res.status(201).json(chat);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating chat' });
    }
};
exports.createChat = createChat;
const getChat = async (req, res) => {
    try {
        const chat = await Chat_1.ChatModel.findById(req.params.chatId)
            .populate('participants', 'username location lastOnline');
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        // Verify user is participant
        if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
            return res.status(403).json({ error: 'Not authorized to access this chat' });
        }
        res.json(chat);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching chat' });
    }
};
exports.getChat = getChat;
const getUserChats = async (req, res) => {
    try {
        const chats = await Chat_1.ChatModel.find({
            participants: req.user._id
        })
            .populate('participants', 'username location lastOnline')
            .sort({ updatedAt: -1 });
        res.json(chats);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching chats' });
    }
};
exports.getUserChats = getUserChats;
