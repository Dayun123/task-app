const fs = require('fs');
const util = require('util');
const path = require('path');

const readFile = util.promisify(fs.readFile);
const configPath = path.join(__dirname, '../../config.json');

module.exports = async () => {
  const configData = await readFile(configPath, 'utf8');
  return JSON.parse(configData);
};