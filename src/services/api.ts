import type { BlogPost, ApiResponse, Comment, User, AuthResponse } from '../types/blog';

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

// user registration 
export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to register user');
    }

    return result.user || [];
};

// user login
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Invalid email or password');
    }

    return result;
};

// publish a new blog post (Protected: Requires Bearer Token)
export const createBlog = async (title: string, content: string, token: string): Promise<BlogPost> => {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to create blog post');
    }
    return result;
};

//Add a Comment (Protected: Requires Bearer Token)

export const addComment = async (blogId: string, content: string, token: string): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to post comment');
    }
    return result;
};