import { createServer } from 'http';
import { connectToDatabase } from './config/db';
import { UserController } from './controllers/userController';
import { UserService } from './services/userService';
import { UserModel} from './models/user';
import {PostModel} from './models/post'
import {CommentModel } from './models/comment'
async function startServer() {
  const db = await connectToDatabase();
  
  // Initialize models
  const userModel = new UserModel(db);
  const postModel = new PostModel(db);
  const commentModel = new CommentModel(db);

  // Initialize services
  const userService = new UserService(userModel, postModel, commentModel);

  // Initialize controllers
  const userController = new UserController(userService);

  const server = createServer(async (req, res) => {
    try {
      const { method, url } = req;
      
      // Parse URL
      const parsedUrl = new URL(url || '', `http://${req.headers.host}`);
      const pathname = parsedUrl.pathname;
      const query = parsedUrl.searchParams;

      // Route handling
      if (method === 'GET' && pathname === '/load') {
        await userController.loadUsers(req, res);
      } 
      else if (method === 'DELETE' && pathname === '/users') {
        await userController.deleteAllUsers(req, res);
      }
      else if (method === 'DELETE' && pathname.startsWith('/users/')) {
        await userController.deleteUser(req, res);
      }
      else if (method === 'GET' && pathname.startsWith('/users/')) {
        await userController.getUser(req, res);
      }
      else if (method === 'PUT' && pathname === '/users') {
        await userController.createUser(req, res);
      }
      else if (method === 'GET' && pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'healthy' }));
      }
      else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
    } catch (error) {
      console.error('Server error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);