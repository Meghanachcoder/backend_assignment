import express, { Express } from 'express';
import { UserController } from './controllers/userController';
import { PostController } from './controllers/postController';
import { CommentController } from './controllers/commentController';
import { UserService } from './services/userService';
import { PostService } from './services/postService';
import { CommentService } from './services/commentService';
import { UserModel} from './models/user';
import {PostModel} from './models/post'
import {CommentModel } from './models/comment'
import { connectToDatabase } from './config/db';

export async function createApp(): Promise<Express> {
  const app = express();
  app.use(express.json());

  // Connect to database
  const db = await connectToDatabase();

  // Initialize models
  const userModel = new UserModel(db);
  const postModel = new PostModel(db);
  const commentModel = new CommentModel(db);

  // Initialize services
  const userService = new UserService(userModel, postModel, commentModel);
  const postService = new PostService(postModel);
  const commentService = new CommentService(commentModel);

  // Initialize controllers
  const userController = new UserController(userService);
  const postController = new PostController(postService);
  const commentController = new CommentController(commentService);

  // Routes
  app.get('/load', userController.loadUsers.bind(userController));
  app.delete('/users', userController.deleteAllUsers.bind(userController));
  app.delete('/users/:userId', userController.deleteUser.bind(userController));
  app.get('/users/:userId', userController.getUser.bind(userController));
  app.put('/users', userController.createUser.bind(userController));

  // Post routes
  app.get('/users/:userId/posts', postController.getPostsByUser.bind(postController));

  // Comment routes
  app.get('/posts/:postId/comments', commentController.getCommentsByPost.bind(commentController));

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
  });

  return app;
}