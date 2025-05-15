import { Request, Response } from 'express';
import { PostService } from '../services/postService';

export class PostController {
  private postService: PostService;

  constructor(postService: PostService) {
    this.postService = postService;
  }

  async getPostsByUser(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    try {
      const posts = await this.postService.getPostsByUser(userId);
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error getting posts:', error);
      res.status(500).json({ error: 'Failed to get posts' });
    }
  }
}