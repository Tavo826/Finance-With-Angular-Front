export interface TransactionRequest {
    amount: number;
    type: string;
    subject: string;
    person_business: string;
    description: string;
    created: string;
    created_at: string;
    updated_at: string;
}

export interface TransactionResponse extends TransactionRequest {
    _id: number;
}

export interface ApiResponseList {
    body: TransactionResponse[];
    message: string;
    success: boolean;
}

export interface ApiResponse {
    body: TransactionResponse;
    message: string;
    success: boolean;
}