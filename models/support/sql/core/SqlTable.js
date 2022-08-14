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

  query(sql) {
    return this.#_db.query(sql);
  }

  async queryAsync(sql) {
    return await this.query(sql);
  }

  async queryForRowsAsync(sql) {
    const { rows } = await this.queryAsync(sql);
  }

  async queryForItemAsync(sql) {
    const [item] = await this.queryForRowsAsync(sql);
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
