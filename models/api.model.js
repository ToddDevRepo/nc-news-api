const { Paths } = require("../globals");
const { JsonFileReader } = require("./support/fs/JsonFileReader");

module.exports.readEndpointsAsync = async () => {
  const jsonReader = new JsonFileReader(Paths.ENDPOINTS_PATH);
  return await jsonReader.read2ObjectAsync();
};
