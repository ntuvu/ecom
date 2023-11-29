const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

function updateNestedObjectParser(obj, prefix = '') {
  const result = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(result, updateNestedObjectParser(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
}

function removeUndefinedAndNull(obj) {
  const result = {};

  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      obj[key] !== undefined &&
      obj[key] !== null
    ) {
      result[key] = obj[key];
    }
  }

  return result;
}

module.exports = {
  getInfoData,
  updateNestedObjectParser,
  removeUndefinedAndNull,
};
