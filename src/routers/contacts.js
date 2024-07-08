import express from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';

import {
  getAllContactsController,
  getContactByIdController,
} from '../controllers/contacts.js';
import isValidId from '../middlewares/isValidId.js';

const contactsRouter = express.Router();

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

export default contactsRouter;
