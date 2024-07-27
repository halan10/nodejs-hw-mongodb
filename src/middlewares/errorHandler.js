import { HttpError } from 'http-errors';

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, _next) => {
  if (error instanceof HttpError) {
    const { status, message } = error;
    res.status(status).json({
      status,
      message,
      data: error,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
};

export default errorHandler;
