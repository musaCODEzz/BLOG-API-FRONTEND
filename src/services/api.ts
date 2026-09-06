import type { BlogPost, ApiResponse, Comment } from '../types/blog';

// 1. The centralized base URL of your live Render backend
const API_BASE_URL = 'https://blog-api-backend-mh0s.onrender.com/api';

// 2. Function to fetch the list of blog posts
export const getBlogs = async (): Promise<BlogPost[]> => {
  const response = await fetch(`${API_BASE_URL}/blogs`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const result: ApiResponse<BlogPost[]> = await response.json();
  return result.data;
};

// 3. Fetch a single blog post by MongoDB _id
export const getBlogPostById = async (id: string): Promise<BlogPost> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`);

    if (!response.ok) {
        throw new Error(`Failed to load post: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

// 4. Fetch all comments for a specific blog post
export const getCommentsByBlogId = async (blogId: string): Promise<Comment[]> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments`);

    if (!response.ok) {
        throw new Error(`Failed to load comments: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
};