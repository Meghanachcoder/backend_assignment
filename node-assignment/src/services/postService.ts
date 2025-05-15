import { PostModel } from '../models/post';
import { Post } from '../types/types';
import { fetchPosts } from '../utils/fetchData';

export class PostService {
  private postModel: PostModel;

  constructor(postModel: PostModel) {
    this.postModel = postModel;
  }

  async createPostsForUser(userId: number): Promise<Post[]> {
    const posts = await fetchPosts(userId);
    await this.postModel.createPosts(posts);
    return posts;
  }

  async getPostsByUser(userId: number): Promise<Post[]> {
    return this.postModel.getPostsByUser(userId);
  }

  async deletePostsByUser(userId: number): Promise<void> {
    await this.postModel.deletePostsByUser(userId);
  }
}