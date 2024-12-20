"use strict";
//C:\Users\kygao\global-chat-backend\src\models\User.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true }
    },
    tickets: { type: Number, default: 5 },
    lastOnline: { type: Date, default: Date.now },
    souvenirCollection: [{
            sId: Number,
            name: String,
            tier: {
                type: String,
                enum: ['d', 'c', 'b', 'a', 's']
            },
            lat: Number,
            lon: Number,
            country: String,
            state: String,
            city: String,
            ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            giverId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            obtainedAt: { type: Date, default: Date.now }
        }],
    backpack: [{
            sId: Number,
            name: String,
            tier: {
                type: String,
                enum: ['d', 'c', 'b', 'a', 's']
            },
            lat: Number,
            lon: Number,
            country: String,
            state: String,
            city: String,
            ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            giverId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            obtainedAt: { type: Date, default: Date.now }
        }],
    friends: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcryptjs_1.default.hash(this.password, 10);
    }
    next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
exports.UserModel = mongoose_1.default.model('User', userSchema);
