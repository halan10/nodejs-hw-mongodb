import Contact from '../db/Contact.js';

export const getContacts = () => Contact.find();
export const getContactById = (id) => Contact.findById(id);
