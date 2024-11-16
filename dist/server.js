"use strict";
//C:\Users\kygao\global-chat-backend\src\server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
const socket_1 = require("./socket");
const ticketRefill_1 = require("./services/ticketRefill");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? 'https://your-production-domain.com'
            : 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-frontend-domain.com', 'https://your-china-domain.com']
        : 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    // Start ticket refill service after DB connection
    (0, ticketRefill_1.startTicketRefillService)();
})
    .catch((error) => console.error('MongoDB connection error:', error));
// Setup routes
(0, routes_1.setupRoutes)(app);
// Setup Socket.io handlers
(0, socket_1.setupSocketHandlers)(io);
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    // First close the HTTP server
    httpServer.close(() => {
        console.log('HTTP server closed.');
        // Then close MongoDB connection
        mongoose_1.default.connection.close()
            .then(() => {
            console.log('MongoDB connection closed.');
            process.exit(); // No arguments needed
        })
            .catch((err) => {
            console.error('Error during shutdown:', err);
            process.exit(1);
        });
    });
    // Fallback force-quit
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
});
