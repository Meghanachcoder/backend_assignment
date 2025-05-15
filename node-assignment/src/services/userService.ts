import { UserModel} from '../models/user';
import {PostModel} from '../models/post'
import {CommentModel } from '../models/comment'
import { User, UserWithPostsAndComments, CreateUserInput } from '../types/types';
import { fetchUsers, fetchPosts, fetchComments } from '../utils/fetchData';

export class UserService {
  private userModel: UserModel;
  private postModel: PostModel;
  private commentModel: CommentModel;

  constructor(userModel: UserModel, postModel: PostModel, commentModel: CommentModel) {
    this.userModel = userModel;
    this.postModel = postModel;
    this.commentModel = commentModel;
  }

    async getAllUsers(): Promise<User[]> {
    return this.userModel.getAllUsers();
  }

  async userExists(userId: number): Promise<boolean> {
    return this.userModel.userExists(userId);
  }

  async loadUsers(): Promise<void> {
    // Fetch first 10 users from the API
    const users = await fetchUsers();
    const usersToLoad = users.slice(0, 10);

    for (const user of usersToLoad) {
      // Check if user already exists
      const exists = await this.userModel.userExists(user.id);
      if (!exists) {
        // Save user
        await this.userModel.createUser(user);

        // Fetch and save user's posts
        const posts = await fetchPosts(user.id);
        await this.postModel.createPosts(posts);

        // Fetch and save comments for each post
        for (const post of posts) {
          const comments = await fetchComments(post.id);
          await this.commentModel.createComments(comments);
        }
      }
    }
  }

  async deleteAllUsers(): Promise<void> {
    // Get all user IDs first
    const users = await this.userModel.getAllUsers();
    const userIds = users.map(user => user.id);

    // Delete all posts by these users
    await this.postModel.deletePostsByUsers(userIds);

    // Get all post IDs to delete their comments
    const posts = await this.postModel.getPostsByUsers(userIds);
    const postIds = posts.map(post => post.id);

    // Delete all comments for these posts
    await this.commentModel.deleteCommentsByPosts(postIds);

    // Finally delete all users
    await this.userModel.deleteAllUsers();
  }

  async deleteUser(userId: number): Promise<boolean> {
    // First delete user's posts
    await this.postModel.deletePostsByUser(userId);

    // Get post IDs to delete their comments
    const posts = await this.postModel.getPostsByUser(userId);
    const postIds = posts.map(post => post.id);

    // Delete comments for these posts
    await this.commentModel.deleteCommentsByPosts(postIds);

    // Finally delete the user
    return await this.userModel.deleteUser(userId);
  }

  async getUserWithPostsAndComments(userId: number): Promise<UserWithPostsAndComments | null> {
    const user = await this.userModel.getUser(userId);
    if (!user) {
      return null;
    }

    const posts = await this.postModel.getPostsByUser(userId);
    const postIds = posts.map(post => post.id);
    const allComments = await this.commentModel.getCommentsByPosts(postIds);

    // Map comments to posts
    const postsWithComments = posts.map(post => ({
      ...post,
      comments: allComments.filter(comment => comment.postId === post.id)
    }));

    return {
      ...user,
      posts: postsWithComments
    };
  }

  async createUser(userData: CreateUserInput): Promise<User> {
    // If ID is not provided, generate a new one
    let userId = userData.id;
    if (!userId) {
      const maxId = await this.userModel.getMaxUserId();
      userId = maxId + 1;
    }

    // Check if user already exists
    const exists = await this.userModel.userExists(userId);
    if (exists) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: userId,
      ...userData
    };

    await this.userModel.createUser(newUser);
    return newUser;
  }
}