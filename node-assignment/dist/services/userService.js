"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.deleteAllUsers = exports.deleteUserById = exports.getUserById = exports.loadUsers = void 0;
const mongodb_1 = require("mongodb");
const connectDB_1 = __importDefault(require("../connectDB"));
const userCollection = 'users';
const postCollection = 'posts';
const commentCollection = 'comments';
const loadUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, connectDB_1.default)();
    const users = yield fetch('https://jsonplaceholder.typicode.com/users');
    const posts = yield fetch('https://jsonplaceholder.typicode.com/posts');
    const comments = yield fetch('https://jsonplaceholder.typicode.com/comments');
    const usersData = yield users.json();
    const postsData = yield posts.json();
    const commentsData = yield comments.json();
    const userCollection = db.collection('users');
    const postCollection = db.collection('posts');
    const commentCollection = db.collection('comments');
    yield userCollection.insertMany(usersData);
    yield postCollection.insertMany(postsData);
    yield commentCollection.insertMany(commentsData);
    return { status: 200, message: 'Data Loaded Successfully' };
});
exports.loadUsers = loadUsers;
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, connectDB_1.default)();
    const user = yield db.collection(userCollection).findOne({ _id: new mongodb_1.ObjectId(userId) });
    if (!user) {
        return { status: 404, message: 'User Not Found' };
    }
    const posts = yield db.collection(postCollection).find({ userId: parseInt(userId) }).toArray();
    const comments = yield db.collection(commentCollection).find({ postId: { $in: posts.map(post => post.id) } }).toArray();
    return {
        user,
        posts,
        comments,
    };
});
exports.getUserById = getUserById;
const deleteUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, connectDB_1.default)();
    yield db.collection(userCollection).deleteOne({ _id: new mongodb_1.ObjectId(userId) });
    return { status: 200, message: 'User Deleted' };
});
exports.deleteUserById = deleteUserById;
const deleteAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, connectDB_1.default)();
    yield db.collection(userCollection).deleteMany({});
    return { status: 200, message: 'All Users Deleted' };
});
exports.deleteAllUsers = deleteAllUsers;
const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, connectDB_1.default)();
    const existingUser = yield db.collection(userCollection).findOne({ email: user.email });
    if (existingUser) {
        return { status: 409, message: 'User Already Exists' };
    }
    const result = yield db.collection(userCollection).insertOne(user);
    return { status: 201, message: 'User Added', userId: result.insertedId };
});
exports.addUser = addUser;
