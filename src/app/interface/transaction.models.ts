import { OriginResponse } from "./origin.models";

export interface TransactionRequest {
    amount: number;
    user_id: string;
    origin_id: string
    type: string;
    subject: string;
    output_category: string;
    person_business: string;
    description: string;
    created: string;
    created_at: string;
    updated_at: string;
}

export interface TransactionResponse extends TransactionRequest {
    _id: string;
    origin: OriginResponse | null | undefined
}

export interface PaginatedTransactionResponse {
    page: number;
    limit: number;
    totalDocuments: number;
    totalPages: number;
    data: TransactionResponse[];
}

export interface ApiTransactionResponseList {
    body: PaginatedTransactionResponse;
    message: string;
    success: boolean;
}

export interface ApiTransactionResponse {
    body: TransactionResponse;
    message: string;
    success: boolean;
}