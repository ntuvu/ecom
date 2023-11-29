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

const inputObject = {
  a: {
    b: 1,
    c: 2,
  },
  d: {
    e: {
      f: 3,
      g: 4,
      j: 5,
      x: {
        m: undefined,
        n: null,
      },
    },
  },
};

const updatedObject = updateNestedObjectParser(inputObject);
console.log(removeUndefinedAndNull(updatedObject));
