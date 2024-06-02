const { FilePaths } = require('../globals');
const { JsonFileReader } = require('./support/fs/JsonFileReader');

module.exports.readEndpointsAsync = async () => {
  const jsonReader = new JsonFileReader(FilePaths.ENDPOINTS_JSON);
  return await jsonReader.readFile2JsObjectAsync();
};
