class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong") {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = [];
 
        // Capture stack trace if not provided
        if (!this.stack) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };