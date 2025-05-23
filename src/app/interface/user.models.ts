export interface User {
    _id: string
    username: string
    email: string
    role: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    username: string
    email: string
    password: string
}

export interface TokenResponse {
    token: string
    user: User
}

export interface UserResponse {
    _id: string
    username: string
    email: string
    role: string
    created_at: string
    updated_at: string
}

export interface ApiUserResponse {
    body: UserResponse
    message: string;
    success: boolean;
}

export interface ApiAuthRespose {
    body: TokenResponse
    message: string;
    success: boolean;
}