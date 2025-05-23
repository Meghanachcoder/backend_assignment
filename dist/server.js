"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connectDB_1 = __importDefault(require("./connectDB"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
(0, connectDB_1.default)();
app.get('/', (_req, res) => {
    res.send('Server is working!');
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
