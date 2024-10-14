import { HttpError } from 'http-errors';

export const errorHandler = (error, _, req, res, __, next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({
      status: error.status,
      message: error.message,
      data: error || error,
    });
    return;
  }
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
};
