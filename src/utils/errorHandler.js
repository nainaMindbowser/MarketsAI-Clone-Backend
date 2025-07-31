class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

const globalErrorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err?.message,
  });
};

module.exports = {
  AppError,
  catchAsync,
  globalErrorHandler,
};
