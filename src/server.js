import express from 'express';
import pino from 'pino-http';
import mongoose from 'mongoose';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllContacts, getContactsById } from './services/contacts.js';

const PORT = Number(env('PORT', '3001'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Please enter /contacts in url!',
    });
  });
  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.json({
        status: 404,
        message: 'Invalid contact ID format',
      });
    }

    try {
      const contact = await getContactsById(contactId);
      if (!contact) {
        return res.json({
          status: 404,
          message: 'Contact not found',
        });
      }

      res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  });

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
