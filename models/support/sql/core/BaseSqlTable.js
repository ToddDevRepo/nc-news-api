const { PrefixedField } = require('./PrefixedField');

class BaseSqlTable {
  #_config;
  #_prefixedField;

  constructor(config) {
    this.#_config = config;
    this.#_prefixedField = new PrefixedField(this.tableName, this.fields);
  }

  get tableName() {
    return this.#_config.tableName;
  }

  get fields() {
    return this.#_config.fields;
  }

  get prefixedField() {
    return this.#_prefixedField;
  }
}

module.exports.BaseSqlTable = BaseSqlTable;
