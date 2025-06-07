export interface User {
    _id: string
    username: string
    email: string
    role: string
    profile_image?: string
}

export interface UserRequest {
    username: string
    email: string
}

export interface EditUserRequest extends UserRequest {
    profileImage: any
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

export interface UserResponse extends User {
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