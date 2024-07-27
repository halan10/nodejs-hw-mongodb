import Contact from '../db/Contact.js';

export const getContacts = () => Contact.find();
export const getContactById = (id) => Contact.findById(id);
export const addConatct = (data) => Contact.create(data);
export const updateContact = async (filter, data, option = {}) => {
  const result = await Contact.findOneAndUpdate(filter, data, {
    new: true,
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
