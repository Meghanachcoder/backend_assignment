import { Request, Response } from 'express';
import { CommentService } from '../services/commentService';

export class CommentController {
  private commentService: CommentService;

  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  async getCommentsByPost(req: Request, res: Response): Promise<void> {
    const postId = parseInt(req.params.postId, 10);
    if (isNaN(postId)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }

    try {
      const comments = await this.commentService.getCommentsByPosts([postId]);
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error getting comments:', error);
      res.status(500).json({ error: 'Failed to get comments' });
    }
  }
}