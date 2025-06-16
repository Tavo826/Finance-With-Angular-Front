import { OriginResponse } from "./origin.models";

export interface TransactionRequest {
    amount: number;
    user_id: string;
    origin_id: string
    type: string;
    subject: string;
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

export interface ApiTransactionResponseList {
    body: TransactionResponse[];
    message: string;
    success: boolean;
}

export interface ApiTransactionResponse {
    body: TransactionResponse;
    message: string;
    success: boolean;
}