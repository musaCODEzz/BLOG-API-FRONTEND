export interface Author {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    website?: string;
    github?: string;
    twitter?: string;
}

export interface BlogPost {
    _id: string;
    title: string;
    content: string;
    author?: Author;
    createdAt: string;
    updatedAt?: string;
    likes?: string[];
    likesCount?: number;
    tags?: string[];
    views?: number;
    readTime?: string;
}

export interface LikeResponse {
    message: string;
    isLiked: boolean;
    likesCount: number;
}

export interface BookmarkResponse {
    message: string;
    isBookmarked: boolean;
    totalBookmarks: number;
}

export interface TagCount {
    tag: string;
    count: number;
}

export interface PopularTagsResponse {
    tags: TagCount[];
}

export interface ApiResponse<T> {
    data: T;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface Comment {
    _id: string;
    content: string;
    blog: string;
    author?: Author;
    createdAt: string;
    updatedAt?: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    website?: string;
    github?: string;
    twitter?: string;
    bookmarks?: string[];
}

export interface UserProfileUpdatePayload {
    name?: string;
    bio?: string;
    avatar?: string;
    website?: string;
    github?: string;
    twitter?: string;
    oldPassword?: string;
    newPassword?: string;
}

export interface UserProfileResponse {
    message: string;
    user: User;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PaginatedBlogs {
    data: BlogPost[];
    pagination: PaginationInfo;
}