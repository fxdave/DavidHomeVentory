const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

const shortName = uniqueNamesGenerator({
  dictionaries: [adjectives, animals], // colors can be omitted here as not used
  length: 2,
  style: 'capital',
  separator: ' '
}); // big-donkey

console.log(shortName)
