"use strict";
//C:\Users\kygao\global-chat-backend\src\controllers\user.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLocation = exports.getProfile = void 0;
const User_1 = require("../models/User");
const getProfile = async (req, res) => {
    try {
        const user = await User_1.UserModel.findById(req.user._id)
            .select('-password')
            .populate('friends', 'username location lastOnline');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching profile' });
    }
};
exports.getProfile = getProfile;
const updateLocation = async (req, res) => {
    try {
        const { lat, lon, country, state, city } = req.body;
        const user = await User_1.UserModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.location = { lat, lon, country, state, city };
        await user.save();
        res.json({ message: 'Location updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating location' });
    }
};
exports.updateLocation = updateLocation;
