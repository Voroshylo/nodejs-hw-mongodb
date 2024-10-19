import createHttpError from 'http-errors';

export const checkUserId = async (req, res, next) => {
  const { user } = req;

  if (!user) {
    next(createHttpError(401, 'Unauthorized'));
  }

  next();
};
