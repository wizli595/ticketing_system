type FormErrors = {
    message: string;
    field?: string;
}
interface CustomError extends AxiosError {
    errors?: FormErrors[];
}

export type { CustomError};