export interface OriginRequest {
    user_id: string;
    name: string,
    total: number;
    created_at: string;
    updated_at: string;
}

export interface OriginResponse extends OriginRequest {
    _id: string
}

export interface ApiOriginResponse {
    body: OriginResponse;
    message: string;
    success: boolean;
}

export interface ApiOriginResponseList {
    body: OriginResponse[];
    message: string;
    success: boolean;
}