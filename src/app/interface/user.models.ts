export interface User {
    id: number
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

export interface ApiAuthRespose {
    body: TokenResponse
    message: string;
    success: boolean;
}