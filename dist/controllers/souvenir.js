"use strict";
//C:\Users\kygao\global-chat-backend\src\controllers\souvenir.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeSouvenir = exports.drawSouvenir = void 0;
const Souvenir_1 = require("../models/Souvenir");
const User_1 = require("../models/User");
const Chat_1 = require("../models/Chat");
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
// Select tier based on new probabilities
const selectTier = () => {
    const rand = Math.random() * 100;
    if (rand < 50)
        return 'd'; // 50%
    if (rand < 80)
        return 'c'; // 30%
    if (rand < 92)
        return 'b'; // 12%
    if (rand < 98)
        return 'a'; // 6%
    return 's'; // 2%
};
// Select souvenir based on distance
const selectSouvenirByDistance = (souvenirs, userLat, userLon) => {
    // Calculate distances and sort souvenirs
    const souvenirsWithDistance = souvenirs.map(s => ({
        ...s,
        distance: calculateDistance(userLat, userLon, s.lat, s.lon)
    })).sort((a, b) => a.distance - b.distance);
    const rand = Math.random() * 100;
    if (rand < 30) {
        // 30% chance: closest souvenir
        return souvenirsWithDistance[0];
    }
    else if (rand < 60) {
        // 30% chance: 2nd or 3rd closest
        const index = Math.floor(Math.random() * 2) + 1;
        return souvenirsWithDistance[index] || souvenirsWithDistance[0];
    }
    else if (rand < 85) {
        // 25% chance: 4th-6th closest
        const index = Math.floor(Math.random() * 3) + 3;
        return souvenirsWithDistance[index] || souvenirsWithDistance[0];
    }
    else if (rand < 95) {
        // 10% chance: 7th-12th closest
        const index = Math.floor(Math.random() * 6) + 6;
        return souvenirsWithDistance[index] || souvenirsWithDistance[0];
    }
    else {
        // 5% chance: random
        return souvenirs[Math.floor(Math.random() * souvenirs.length)];
    }
};
// Create UserSouvenir instance from Souvenir
const createUserSouvenir = (souvenir, ownerId, giverId) => ({
    sId: souvenir.sId,
    name: souvenir.name,
    tier: souvenir.tier,
    lat: souvenir.lat,
    lon: souvenir.lon,
    country: souvenir.country,
    state: souvenir.state,
    city: souvenir.city,
    ownerId,
    giverId,
    obtainedAt: new Date()
});
const drawSouvenir = async (req, res) => {
    try {
        const user = await User_1.UserModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if user has tickets
        if (user.tickets < 1) {
            return res.status(400).json({ error: 'No tickets available' });
        }
        // Deduct ticket
        user.tickets -= 1;
        // Select tier and get souvenirs of that tier
        const tier = selectTier();
        const souvenirs = await Souvenir_1.SouvenirModel.find({ tier });
        if (souvenirs.length === 0) {
            return res.status(500).json({ error: 'No souvenirs available' });
        }
        // Select souvenir based on distance
        const selectedSouvenir = selectSouvenirByDistance(souvenirs, user.location.lat, user.location.lon);
        // Create UserSouvenir instance
        const userSouvenir = {
            sId: selectedSouvenir.sId,
            name: selectedSouvenir.name,
            tier: selectedSouvenir.tier,
            lat: selectedSouvenir.lat,
            lon: selectedSouvenir.lon,
            country: selectedSouvenir.country,
            state: selectedSouvenir.state,
            city: selectedSouvenir.city,
            ownerId: user._id.toString(),
            obtainedAt: new Date()
        };
        // Check if user already has this souvenir in collection
        const hasInCollection = user.souvenirCollection.some(s => s.sId === selectedSouvenir.sId);
        if (!hasInCollection) {
            user.souvenirCollection.push(userSouvenir);
        }
        else {
            user.backpack.push(userSouvenir);
        }
        await user.save();
        res.json({
            souvenir: userSouvenir,
            addedTo: hasInCollection ? 'backpack' : 'souvenirCollection',
            remainingTickets: user.tickets
        });
    }
    catch (error) {
        console.error('Draw souvenir error:', error);
        res.status(500).json({ error: 'Error drawing souvenir' });
    }
};
exports.drawSouvenir = drawSouvenir;
// Update the exchange souvenir function as well
const exchangeSouvenir = async (req, res) => {
    try {
        const { souvenirId, receiverId, chatId } = req.body;
        const senderId = req.user._id;
        // Verify chat exists and has enough messages
        const chat = await Chat_1.ChatModel.findById(chatId);
        if (!chat || chat.messages.length < 10) {
            return res.status(400).json({
                error: 'Chat must have at least 10 messages for souvenir exchange'
            });
        }
        const [sender, receiver] = await Promise.all([
            User_1.UserModel.findById(senderId),
            User_1.UserModel.findById(receiverId)
        ]);
        if (!sender || !receiver) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Find the souvenir in sender's backpack
        const souvenirIndex = sender.backpack.findIndex(s => s.sId.toString() === souvenirId);
        if (souvenirIndex === -1) {
            return res.status(400).json({ error: 'Souvenir not found in backpack' });
        }
        // Get the souvenir and update its giverId
        const souvenir = sender.backpack[souvenirIndex];
        const exchangedSouvenir = {
            ...souvenir,
            ownerId: receiver._id.toString(),
            giverId: sender._id.toString(),
            obtainedAt: new Date()
        };
        // Remove from sender's backpack
        sender.backpack.splice(souvenirIndex, 1);
        // Add to receiver's collection or backpack
        const hasInCollection = receiver.souvenirCollection.some(s => s.sId === souvenir.sId);
        if (!hasInCollection) {
            receiver.souvenirCollection.push(exchangedSouvenir);
        }
        else {
            receiver.backpack.push(exchangedSouvenir);
        }
        // Add users as friends if they aren't already
        if (!sender.friends.includes(receiver._id)) {
            sender.friends.push(receiver._id);
        }
        if (!receiver.friends.includes(sender._id)) {
            receiver.friends.push(sender._id);
        }
        // Mark chat as having exchanged souvenirs
        chat.souvenirExchanged = true;
        await Promise.all([
            sender.save(),
            receiver.save(),
            chat.save()
        ]);
        res.json({
            message: 'Souvenir exchanged successfully',
            addedTo: hasInCollection ? 'backpack' : 'souvenirCollection'
        });
    }
    catch (error) {
        console.error('Exchange souvenir error:', error);
        res.status(500).json({ error: 'Error exchanging souvenir' });
    }
};
exports.exchangeSouvenir = exchangeSouvenir;
