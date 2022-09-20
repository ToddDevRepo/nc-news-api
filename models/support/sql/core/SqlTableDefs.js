const { PrefixedField } = require("./PrefixedField");

class SqlTableDefs {
  #_config;
  #_prefixed;

  constructor(config) {
    this.#_config = config;
    this.#_prefixed = new PrefixedField(this.tableName, this.fields);
  }

  get tableName() {
    return this.#_config.tableName;
  }

  get fields() {
    return this.#_config.fields;
  }

  get prefixedField() {
    return this.#_prefixed;
  }
}

module.exports.SqlTableDefs = SqlTableDefs;
