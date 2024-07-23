import createHttpError from 'http-errors';

import {
  getContacts,
  getContact,
  addConatct,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import env from '../utils/env.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import saveFileToPublicDir from '../utils/saveFileToPublicDir.js';

import { contactFieldList } from '../constants/contacts.js';
import parseContactFilterParams from '../utils/parseContactFilterParams.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';

const enable_cloudinary = env('ENABLE_CLOUDINARY');

export const getAllContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, contactFieldList);
  const filter = { ...parseContactFilterParams(req.query), userId };
  const data = await getContacts({ page, perPage, sortBy, sortOrder, filter });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const data = await getContact({ _id: contactId, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;

  let photo = '';

  if (req.file) {
    if (enable_cloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'photos');
    } else {
      photo = await saveFileToPublicDir(req.file, 'photos');
    }
  }
  const data = await addConatct({ ...req.body, userId, photo });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { _id: userId } = req.user;

  const { contactId } = req.params;

  let photo = '';

  if (req.file) {
    if (enable_cloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'photos');
    } else {
      photo = await saveFileToPublicDir(req.file, 'photos');
    }
  }
  const result = await updateContact(
    { _id: contactId, userId },
    {
      ...req.body,
      photo,
    },
  );
  if (!result) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};
export const deleteContactController = async (req, res) => {
  const { _id: userId } = req.user;

  const { contactId } = req.params;
  const result = await deleteContact({ _id: contactId, userId });
  if (!result) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }
  res.status(204).send();
};
