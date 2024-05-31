class SqlQueryHelper {
  #_connection;

  constructor(connection) {
    this.#_connection = connection;
  }

  query(sql, params) {
    return this.#_connection.query(sql, params);
  }

  async queryForRowsAsync(sql, params) {
    const { rows } = await this.#_connection.query(sql, params);
    return rows;
  }

  async queryForItemAsync(sql, params) {
    const [item] = await this.queryForRowsAsync(sql, params);
    return item;
  }

  async insertColumnValuesAsync(table, columns, values) {
    const columnsString = columns.join(', ');
    const valueIndicesString = values
      .map((val, idx) => `$${idx + 1}`)
      .join(', ');
    const insertQuery = await this.queryForItemAsync(
      `INSERT INTO ${table} (${columnsString}) VALUES (${valueIndicesString}) RETURNING *;`,
      values
    );
    return insertQuery;
  }

  async deleteItemWhereAsync(table, column, value) {
    const dbResult = await this.#_connection.query(
      `DELETE FROM ${table} WHERE ${column} = $1;`,
      [value]
    );
    return dbResult.rowCount !== 0;
  }

  async selectAllRowsAsync(tableName) {
    const rows = this.queryForRowsAsync(`SELECT * FROM ${tableName};`);
    return rows;
  }

  async selectAllRowsWhereAsync(tableName, column, value) {
    const rows = this.queryForRowsAsync(
      `SELECT * FROM ${tableName} WHERE ${column} = $1;`,
      [value]
    );
    return rows;
  }
}

module.exports.SqlQueryHelper = SqlQueryHelper;
