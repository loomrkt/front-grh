export interface PaginatedResult<T> {
    success: boolean;
    code: number;
    message: string;
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPage: number;
    };
    data: T[];
}
