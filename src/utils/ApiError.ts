class ApiError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    success: boolean;

    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.success = `${statusCode}`.startsWith("4") || `${statusCode}`.startsWith("5") ? true : false;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor)
    };
};

export default ApiError;