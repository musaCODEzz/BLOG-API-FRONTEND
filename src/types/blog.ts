export interface Author{
    _id: string;
    name: string;
    email: string;
}
export interface BlogPost{
    _id: string;
    title: string;
    content: string;
    author?: Author;
    createdAt: string;
    updatedAt?: string;
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

export interface Comment{
    _id: string;
    content: string;
    blog: string;
    author?: Author;
    createdAt: string;
}