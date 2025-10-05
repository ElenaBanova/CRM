export const RegexEnum = {
  PASSWORD: /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,15})\S$/,
  NAME: /^[A-Z][a-z]{2,9}\S$/,
  COMMENT: /^[A-Z][a-z].{1,25}$/,
  GROUP: /[A-Za-z0-9].{2,10}/,
  PHONE_NUMBER:
    /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/,
};
