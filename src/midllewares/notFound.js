import createHttpError from 'http-errors';

const notFoundMiddleware = () => {
  throw createHttpError(404, 'Route not found');
};

export default notFoundMiddleware;
