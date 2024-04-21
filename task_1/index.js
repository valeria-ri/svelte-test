import { encoded, translations } from './data.js'

const immutableKeys = ['groupId', 'service', 'formatSize', 'ca'];

const decodeObj = (obj, translations, exceptions, uniqueSet) => {
  let newObj = {};
  for (const key in obj) {
    if (exceptions.includes(key) || obj[key] == null) {
      newObj[key] = obj[key];
    }
    else if (!Object.keys(translations).includes(obj[key])) {
      uniqueSet.add(obj[key]);
      newObj[key] = obj[key];
    }
    else {
      newObj[key] = translations[obj[key]];
    }
  }
  return newObj;
};

const decodeData = (arr, translations, exceptions) => {
  let uniqueValues = new Set();
  const decoded = arr.map(i => decodeObj(
    i,
    translations,
    exceptions,
    uniqueValues,
  ));
  return { 
    decoded, 
    uniqueValues: Array.from(uniqueValues)
  };
};

const { decoded, uniqueValues } = decodeData(encoded, translations, immutableKeys);

console.log('Расшифрованные данные:', decoded);
console.log('Уникальные id:', uniqueValues);
