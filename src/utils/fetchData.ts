import { User, Post, Comment } from '../types/types';

const API_BASE = 'https://jsonplaceholder.typicode.com';

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE}/users`);
  return response.json();
}

export async function fetchPosts(userId: number): Promise<Post[]> {
  const response = await fetch(`${API_BASE}/posts?userId=${userId}`);
  return response.json();
}

export async function fetchComments(postId: number): Promise<Comment[]> {
  const response = await fetch(`${API_BASE}/comments?postId=${postId}`);
  return response.json();
}