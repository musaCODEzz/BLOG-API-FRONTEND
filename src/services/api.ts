import type { BlogPost, ApiResponse } from '../types/blog';

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
