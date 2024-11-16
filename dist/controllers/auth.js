"use strict";
//C:\Users\kygao\global-chat-backend\src\controllers\auth.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const register = async (req, res) => {
    try {
        const { username, email, password, location } = req.body;
        // Check if user already exists
        const existingUser = await User_1.UserModel.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return res.status(400).json({
                error: 'User with this email or username already exists'
            });
        }
        const user = new User_1.UserModel({
            username,
            email,
            password,
            location,
            tickets: 5,
            lastOnline: new Date()
        });
        await user.save();
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user, token });
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Update last online
        user.lastOnline = new Date();
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ user, token });
    }
    catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};
exports.login = login;
const logout = async (req, res) => {
    // In a token-based system, the client should discard the token
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
