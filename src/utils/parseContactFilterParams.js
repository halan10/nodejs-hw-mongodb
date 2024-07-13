import { typeList } from '../constants/contacts.js';

const parseBoolean = (value) => {
  if (typeof value !== 'string') return;
  if (!['true', 'false'].includes(value)) return;

  const parsedValue = JSON.parse(value);
  return parsedValue;
};

const parseContactFilterParams = ({ contactType, isFavourite }) => {
  const parsedType = typeList.includes(contactType) ? contactType : null;
  const parsedFavorite = parseBoolean(isFavourite);
  return {
    contactType: parsedType,
    isFavourite: parsedFavorite,
  };
};

export default parseContactFilterParams;
