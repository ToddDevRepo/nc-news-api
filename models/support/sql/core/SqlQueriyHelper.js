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

  async insertColumnValues(table, columns, values) {
    const colsStr = columns.join(", ");
    const valsStr = values.map((val, idx) => `$${idx + 1}`).join(", ");
    const inserted = await this.queryForItemAsync(
      `INSERT INTO ${table} (${colsStr}) VALUES (${valsStr}) RETURNING *;`,
      values
    );
    return inserted;
  }

  async deleteItemWhereAsync(table, colNm, val) {
    const dbResult = await this.#_queryable.query(
      `DELETE FROM ${table} WHERE ${colNm} = $1;`,
      [val]
    );
    return dbResult.rowCount !== 0;
  }

  async selectAllRowsAsync(tableName) {
    const rows = this.queryForRowsAsync(`SELECT * FROM ${tableName};`);
    return rows;
  }

  async selectAllRowsWhereAsync(tableName, colNm, val) {
    const rows = this.queryForRowsAsync(
      `SELECT * FROM ${tableName} WHERE ${colNm} = $1;`,
      [val]
    );
    return rows;
  }
}

module.exports.SqlQueryHelper = SqlQueryHelper;
