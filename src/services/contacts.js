// src/services/students.js
import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculationPaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

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

  if (typeof filter.isFavourite === 'string') {
    filter.isFavourite = filter.isFavourite === 'true';
  }

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
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

export const getContactById = async (payload) => {
  // const contact = await ContactsCollection.findOne({
  //   _id: payload._id,
  //   userId: payload.userId,
  // });
  const contact = await ContactsCollection.findById(payload);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};
export const createContact = async (payload) => {
  const contact = ContactsCollection.create(payload);
  return contact;
};
export const updateContact = async (id, payload, options) => {
  const rawResult = await ContactsCollection.findByIdAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult.value) {
    throw createHttpError(404, `Contact ${id} not found`);
  }
  return {
    contact: rawResult.value,
    // isNew: !rawResult.lastErrorObject.updatedExisting,
  };
};
export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete(contactId);
  return contact;
};
