import { IncomingMessage, ServerResponse } from 'http';
import { UserService } from '../services/userService';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async loadUsers(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      await this.userService.loadUsers();
      res.writeHead(200);
      res.end();
    } catch (error) {
      console.error('Error loading users:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to load users' }));
    }
  }

  async deleteAllUsers(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      await this.userService.deleteAllUsers();
      res.writeHead(204);
      res.end();
    } catch (error) {
      console.error('Error deleting all users:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to delete all users' }));
    }
  }

  async deleteUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const userId = this.getUserIdFromUrl(req.url || '');
    if (isNaN(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid user ID' }));
      return;
    }

    try {
      const deleted = await this.userService.deleteUser(userId);
      if (deleted) {
        res.writeHead(204);
        res.end();
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to delete user' }));
    }
  }

  async getUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const userId = this.getUserIdFromUrl(req.url || '');
    if (isNaN(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid user ID' }));
      return;
    }

    try {
      const user = await this.userService.getUserWithPostsAndComments(userId);
      if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
      }
    } catch (error) {
      console.error('Error getting user:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to get user' }));
    }
  }

  async createUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const body = await this.readRequestBody(req);
      const userData = JSON.parse(body);

      const newUser = await this.userService.createUser(userData);
      res.writeHead(201, {
        'Content-Type': 'application/json',
        'Location': `/users/${newUser.id}`
      });
      res.end(JSON.stringify(newUser));
        } catch (error: unknown) {
      const err = error as Error;
      console.error('Error creating user:', err);

      if (err.message === 'User already exists') {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to create user' }));
      }
}

  }

  private getUserIdFromUrl(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 1], 10);
  }

  private readRequestBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        resolve(body);
      });
      req.on('error', error => {
        reject(error);
      });
    });
  }
}