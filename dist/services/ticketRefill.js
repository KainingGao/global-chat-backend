"use strict";
//C:\Users\kygao\global-chat-backend\src\services\ticketRefill.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTicketRefillService = void 0;
const User_1 = require("../models/User");
const ONLINE_REFILL_INTERVAL = 60 * 1000; // 1 minute
const OFFLINE_REFILL_INTERVAL = 15 * 60 * 1000; // 15 minutes
const MAX_TICKETS = 5;
const startTicketRefillService = () => {
    // Online users ticket refill
    setInterval(async () => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        await User_1.UserModel.updateMany({
            lastOnline: { $gte: fiveMinutesAgo },
            tickets: { $lt: MAX_TICKETS }
        }, { $inc: { tickets: 1 } });
    }, ONLINE_REFILL_INTERVAL);
    // Offline users ticket refill
    setInterval(async () => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        await User_1.UserModel.updateMany({
            lastOnline: { $lt: fiveMinutesAgo },
            tickets: { $lt: MAX_TICKETS }
        }, { $inc: { tickets: 1 } });
    }, OFFLINE_REFILL_INTERVAL);
};
exports.startTicketRefillService = startTicketRefillService;
