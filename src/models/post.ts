import { Db } from 'mongodb';
import { Post } from '../types/types';

export class PostModel {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async createPosts(posts: Post[]): Promise<void> {
    if (posts.length > 0) {
      await this.db.collection('posts').insertMany(posts);
    }
  }

  async getPostsByUser(userId: number): Promise<Post[]> {
    return this.db.collection('posts').find<Post>({ userId }).toArray();
  }

  async getPostsByUsers(userIds: number[]): Promise<Post[]> {
    return this.db.collection('posts').find<Post>({ userId: { $in: userIds } }).toArray();
  }

  async deletePostsByUser(userId: number): Promise<void> {
    await this.db.collection('posts').deleteMany({ userId });
  }

  async deletePostsByUsers(userIds: number[]): Promise<void> {
    await this.db.collection('posts').deleteMany({ userId: { $in: userIds } });
  }

  async deleteAllPosts(): Promise<void> {
    await this.db.collection('posts').deleteMany({});
  }
}