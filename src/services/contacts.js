import Contact from '../db/Contact.js';

import calcPaginationData from '../utils/calcPaginationData.js';

import { contactFieldList } from '../constants/contacts.js';
import { sortOrderList } from '../constants/index.js';

export const getContacts = async ({
  page,
  perPage,
  sortBy = contactFieldList[0],
  sortOrder = sortOrderList[0],
  filter,
}) => {
  const skip = (page - 1) * perPage;
  const databaseQuery = Contact.find();
  if (filter.userId) {
    databaseQuery.where('userId').equals(filter.userId);
  }
  if (filter.contactType) {
    databaseQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    databaseQuery.where('isFavourite').equals(filter.isFavourite);
  }
  const totalItems = await Contact.find().merge(databaseQuery).countDocuments();
  const data = await databaseQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const { totalPages, hasNextPage, hasPreviousPage } = calcPaginationData({
    total: totalItems,
    perPage,
    page,
  });
  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};
export const getContact = (filter) => Contact.findOne(filter);
export const addConatct = (data) => Contact.create(data);
export const updateContact = async (filter, data, option = {}) => {
  const result = await Contact.findOneAndUpdate(filter, data, {
    new: true,
    runValidators: true,
    includeResultMetadata: true,
    ...option,
  });
  if (!result || !result.value) return null;

  const isNew = Boolean(result?.lastErrorObject?.upserted);

  return {
    data: result.value,
    isNew,
  };
};

export const deleteContact = (filter) => Contact.findOneAndDelete(filter);
