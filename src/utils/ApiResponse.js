class ApiResponse {
    static success(res, statusCode, data, message = 'Success') {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }
    static error(res, statusCode, message = 'Internal Server Error') {
        return res.status(statusCode).json({
            success: false,
            message
        });
    }
    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            success: false,
            message
        });
    }
    static created(res, data, message = 'Created successfully') {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }
}

module.exports = ApiResponse;