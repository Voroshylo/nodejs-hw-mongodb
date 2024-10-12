import { ContactsCollection } from '../db/contacts.js';
import { calculatePaginationData } from '../utils/calculationPaginationData.js';
import { SORT_ORDER } from '../constants/index.js';
import { createContactSchema } from '../validation/auth.js';
import createHttpError from 'http-errors';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactsCollection.find({ userId });
  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite === true) {
    contactsQuery.where('isFavourite').equals(true);
  }
  if (filter.isFavourite === false) {
    contactsQuery.where('isFavourite').equals(false);
  }
  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();
  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const paginationData = calculatePaginationData(contactsCount, perPage, page);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found or access denied');
  }
  return contact;
};

export const createContact = async (contactData, userId) => {
  const { error } = createContactSchema.validate(contactData);
  if (error) {
    throw createHttpError(400, error.details[0].message);
  }
  const contactWithUserId = { ...contactData, userId };

  return await ContactsCollection.create(contactWithUserId);
};

export const patchContact = async (contactId, contactData, userId) => {
  const { error } = createContactSchema.validate(contactData);
  if (error) {
    throw createHttpError(400, error.details[0].message);
  }

  const contact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    contactData,
    { new: true },
  );
  if (!contact) {
    throw createHttpError(404, 'Contact not found or access denied');
  }
  return contact;
};

export const deleteContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  if (!contact) {
    throw createHttpError(404, 'Contact not found or access denied');
  }
  return contact;
};
