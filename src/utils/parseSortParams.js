import { sortOrderList } from '../constants/index.js';

const parseSortParams = ({ sortBy, sortOrder }, fieldList) => {
  const parseSortOrder = sortOrderList.includes(sortOrder)
    ? sortOrder
    : sortOrderList[0];

  const parsedSortBy = fieldList.includes(sortBy) ? sortBy : fieldList[0];

  return {
    sortBy: parsedSortBy,
    sortOrder: parseSortOrder,
  };
};
export default parseSortParams;
