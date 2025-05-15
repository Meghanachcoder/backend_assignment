import { CommentModel } from '../models/comment';
import { Comment } from '../types/types';
import { fetchComments } from '../utils/fetchData';

export class CommentService {
  private commentModel: CommentModel;

  constructor(commentModel: CommentModel) {
    this.commentModel = commentModel;
  }

  async createCommentsForPost(postId: number): Promise<Comment[]> {
    const comments = await fetchComments(postId);
    await this.commentModel.createComments(comments);
    return comments;
  }

  async getCommentsByPosts(postIds: number[]): Promise<Comment[]> {
    return this.commentModel.getCommentsByPosts(postIds);
  }

  async deleteCommentsByPosts(postIds: number[]): Promise<void> {
    await this.commentModel.deleteCommentsByPosts(postIds);
  }
}