const parseContactType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isType(type)) return type;
};

const parseFavorite = (favorite) => {
  if (typeof favorite === 'boolean') {
    return favorite;
  }

  return favorite;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedType = parseContactType(contactType);
  const parsedIsFavorite = parseFavorite(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedIsFavorite,
  };
};
