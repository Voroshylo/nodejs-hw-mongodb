// src/validation/auth.js
import Joi from 'joi';

export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
