export interface Result<T> {
    success: boolean;
    code: number;
    message: string;
    data: T;
}