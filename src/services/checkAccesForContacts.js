import { ContactsCollection } from '../db/models/contacts.js';

export const checkAccessForContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await ContactsCollection.find(contactId);
  if (contact.userId.toString() !== req.user._id.toString()) {
    res.status(401).json({
      status: 401,
      message: 'You do not have access rights to this contact',
    });
    return;
  }
  next();
};
