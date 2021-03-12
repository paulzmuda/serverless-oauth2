// Object keys into http query parameter string
module.exports.objectToQueryString = (getParams) => {
  if (!getParams || Object.keys(getParams).length === 0) {
    return '';
  }

  let string = '';
  let keys = Object.keys(getParams);
  keys.forEach((key, i ,arr) => {
    i === 0 ? string += '?' : '';
    string += key + '=' + getParams[key];
    i + 1 === arr.length ? '' : string += '&'
  });

  return string;
}
