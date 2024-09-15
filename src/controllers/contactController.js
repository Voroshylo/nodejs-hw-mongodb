import {
  createContact,
  deleteContact,
  getAllContacts,
  getAllContactsById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (_, res, next) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Sucessfully found contacts!',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getAllContactsById(contactId);
  console.log(contact);
  if (!contact) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);
  if (!req.body.name || !req.body.phoneNumber || !req.body.contactType) {
    throw createHttpError(
      400,
      'Name, phoneNumber, and contactType are required fields!',
    );
  }
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};
