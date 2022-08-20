const { PrefixedField } = require("./PrefixedField");

class SqlTable {
  #_db;
  #_config;
  #_prefixed;

  constructor(db, config) {
    this.#_config = config;
    this.#_db = db;
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

  query(sql, params) {
    return this.#_db.query(sql, params);
  }

  async queryAsync(sql, params) {
    return await this.query(sql, params);
  }

  async queryForRowsAsync(sql, params) {
    const { rows } = await this.queryAsync(sql, params);
    return rows;
  }

  async queryForItemAsync(sql, params) {
    const [item] = await this.queryForRowsAsync(sql, params);
    return item;
  }

  selectAll() {
    return this.query(`SELECT * FROM ${this.tableName};`);
  }

  async selectAllAsync() {
    return await this.selectAll();
  }

  async selectAllRowsAsync() {
    const { rows } = await this.selectAllAsync();
    return rows;
  }
}

module.exports.SqlTable = SqlTable;
