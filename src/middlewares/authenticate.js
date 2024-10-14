import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  console.log('Authorization Header:', authHeader);

  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }
  console.log('Token:', token);

  // Шукаємо сесію за accessToken
  const session = await SessionsCollection.findOne({ accessToken: token });
  console.log('Session:', session);

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findById(session.userId);
  console.log('User:', user);

  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  // Прив'язка користувача до req для подальшого використання
  req.user = user;

  next();
};
