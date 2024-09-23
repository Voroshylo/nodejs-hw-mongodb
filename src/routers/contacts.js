import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  patchContactController,
  getContactsController,
} from '../controllers/contacts.js';

const router = Router();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post('/', ctrlWrapper(createContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

router.patch('/:contactId', ctrlWrapper(patchContactController));

export default router;
