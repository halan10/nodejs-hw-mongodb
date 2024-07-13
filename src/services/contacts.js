import Contact from '../db/Contact.js';

import calcPaginationData from '../utils/calcPaginationData.js';

export const getContacts = async ({ page, perPage }) => {
  const skip = (page - 1) * perPage;
  const totalItems = await Contact.countDocuments();
  const data = await Contact.find().skip(skip).limit(perPage);

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
export const getContactById = (id) => Contact.findById(id);
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
