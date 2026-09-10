import type { BlogPost, Comment, User, AuthResponse, PaginatedBlogs, LikeResponse, TagCount } from '../types/blog';

// 1. The centralized base URL of your backend (supports local dev & production)
const RAW_URL = import.meta.env.VITE_API_URL || 'https://blog-api-backend-mh0s.onrender.com';
const API_BASE_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`;

// 2. Function to fetch the list of blog posts (supports pagination, sort, and tag filtering)
export const getBlogs = async (page: number = 1, limit: number = 10, sort?: string, tag?: string): Promise<PaginatedBlogs> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    if (sort) {
        params.append('sort', sort);
    }
    if (tag) {
        params.append('tag', tag);
    }
    const response = await fetch(`${API_BASE_URL}/blogs?${params.toString()}`);

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json()
    return {
        data: result.data || [],
        pagination: result.pagination || {
            total: result.data?.length || 0,
            page: 1,
            limit: 10,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
        }
    }
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
export const createBlog = async (title: string, content: string, token: string, tags?: string[]): Promise<BlogPost> => {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, tags: tags || [] }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to create blog post');
    }
    return result.data || result;
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

// 9. Request Password Reset Token
export const forgotPassword = async (email: string): Promise<{ message: string; resetToken?: string }> => {
    const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to request password reset');
    }
    return result;
};

// 10. Reset Password using Token
export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to reset password');
    }
    return result;
};

// 11. Authenticate with Google OAuth ID Token
export const loginWithGoogle = async (credential: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Google login failed');
    }
    return result;
};

// 12. Update an existing Blog Post (Protected: Author only)
export const updateBlog = async (id: string, title: string, content: string, token: string, tags?: string[]): Promise<BlogPost> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, ...(tags !== undefined ? { tags } : {}) }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to update blog post');
    }
    return result.data || result;
};

// 13. Delete a Blog Post (Protected: Author only)
export const deleteBlog = async (id: string, token: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to delete blog post');
    }
    return result;
};

// 14. Delete a Comment (Protected: Comment author only)
export const deleteComment = async (blogId: string, commentId: string, token: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to delete comment');
    }
    return result;
};

// 15. Update a Comment (Protected: Comment author only)
export const updateComment = async (
    blogId: string,
    commentId: string,
    content: string,
    token: string
): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to update comment');
    }
    return result.comment || result.data || result;
};

// 16. Toggle Like on a Blog Post (Protected: Logged-in user)
export const likeBlogPost = async (
    id: string,
    token: string
): Promise<LikeResponse> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to toggle like');
    }
    return result;
};

// 17. Fetch Popular Tags with post counts
export const getPopularTags = async (limit: number = 20): Promise<TagCount[]> => {
    const response = await fetch(`${API_BASE_URL}/blogs/tags?limit=${limit}`);

    if (!response.ok) {
        throw new Error(`Failed to load tags: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.tags || [];
};