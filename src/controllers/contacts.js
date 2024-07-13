import createHttpError from 'http-errors';

import {
  getContacts,
  getContactById,
  addConatct,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import parsePaginationParams from '../utils/parsePaginationParams.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const data = await getContacts({ page, perPage });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const data = await getContactById(contactId);

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
  const data = await addConatct(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await updateContact({ _id: contactId }, req.body);
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
  const { contactId } = req.params;
  const result = await deleteContact({ _id: contactId });
  if (!result) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }
  res.status(204).send();
};
