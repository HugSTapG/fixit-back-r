export interface MicroserviceResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    statusCode?: number;
}

export interface PaginatedMicroserviceResponse<T = any> extends MicroserviceResponse<T[]> {
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
