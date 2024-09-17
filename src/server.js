import express from 'express';
import pino from 'pino-http';
import mongoose from 'mongoose';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';
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
    res.status(200).json({
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contact/:contactId', async (req, res, next) => {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        message: 'Invalid contact ID format',
      });
    }

    try {
      const contact = await getContactById(contactId);
      if (!contact) {
        return res.status(404).json({
          message: 'Student not found',
        });
      }

      res.status(200).json({
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
