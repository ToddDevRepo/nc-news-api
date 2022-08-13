const fs = require("fs/promises");

class JsonFileReader {
  #_filePath;

  constructor(filePath) {
    this.#_filePath = filePath;
  }

  async read2ObjectAsync() {
    const json = await fs.readFile(this.#_filePath, "utf-8");
    return JSON.parse(json);
  }
}

module.exports.JsonFileReader = JsonFileReader;
