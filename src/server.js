// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import cookieParser from 'cookie-parser';
import routers from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import { UPLOAD_DIR } from './constants/index.js';

import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = Number(env('PORT', '3000'));
export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Please enter /contacts for url!',
    });
  });
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use(routers);
  app.use('*', notFoundHandler);
  app.use(errorHandlerMiddleware);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
