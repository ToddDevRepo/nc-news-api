class SqlTable {
  #_db;
  #_config;

  constructor(db, config) {
    this.#_config = config;
    this.#_db = db;
  }

  get tableName() {
    return this.#_config.tableName;
  }

  get fields() {
    return this.#_config.fields;
  }

  selectAll() {
    return this.#_db.query(`SELECT * FROM ${this.tableName};`);
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
