import { Db } from 'mongodb';
import { Comment } from '../types/types';

export class CommentModel {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async createComments(comments: Comment[]): Promise<void> {
    if (comments.length > 0) {
      await this.db.collection('comments').insertMany(comments);
    }
  }

  async getCommentsByPosts(postIds: number[]): Promise<Comment[]> {
    return this.db.collection('comments').find<Comment>({ postId: { $in: postIds } }).toArray();
  }

  async deleteCommentsByPosts(postIds: number[]): Promise<void> {
    await this.db.collection('comments').deleteMany({ postId: { $in: postIds } });
  }

  async deleteAllComments(): Promise<void> {
    await this.db.collection('comments').deleteMany({});
  }
}