import express from 'express';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import contactsRouter from './routers/contacts.js';
import cors from 'cors';
import { env } from './utils/env.js';

const PORT = Number(env('PORT', '3001'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.get('/', (req, res) => {
    res.json({
      message: 'Please enter /contacts for url!',
    });
  });

  app.use('/contacts', contactsRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.json({
      status: 500,
      message: 'Something went wrong',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
