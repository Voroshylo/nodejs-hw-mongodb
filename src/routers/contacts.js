import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  crateContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../validation/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkUserId } from '../services/checkUserId.js';

const router = Router();
router.use(authenticate);
router.get('/', checkUserId, ctrlWrapper(getAllContactsController));

router.get(
  '/:contactId',
  checkUserId,
  isValidId,
  ctrlWrapper(getContactByIdController),
);

router.post(
  '/',
  checkUserId,
  validateBody(crateContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:contactId',
  checkUserId,
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
export default router;
