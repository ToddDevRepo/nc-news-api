const fs = require("fs/promises");
const { Paths } = require("../globals");

module.exports.readEndpoints = async () => {
  console.log("api model");
  const json = await fs.readFile(Paths.ENDPOINTS_PATH, "utf-8");
  return JSON.parse(json);
};
