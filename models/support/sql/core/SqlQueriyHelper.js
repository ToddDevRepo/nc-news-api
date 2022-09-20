class SqlQueryHelper {
  #_queryable;

  constructor(queryable) {
    this.#_queryable = queryable;
  }

  query(sql, params) {
    return this.#_queryable.query(sql, params);
  }

  async queryForRowsAsync(sql, params) {
    const { rows } = await this.#_queryable.query(sql, params);
    return rows;
  }

  async queryForItemAsync(sql, params) {
    const [item] = await this.queryForRowsAsync(sql, params);
    return item;
  }

  async selectAllRowsAsync(tableName) {
    const rows = this.queryForRowsAsync(`SELECT * FROM ${tableName};`);
    return rows;
  }
}

module.exports.SqlQueryHelper = SqlQueryHelper;
