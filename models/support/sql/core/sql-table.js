class SqlTable {
  #_name;
  #_db;

  constructor(db, name) {
    this.#_db = db;
    this.#_name = name;
  }

  async countEntriesWhereFieldEqualsAsync(field, value) {
    const {
      rows: [countObj],
    } = await this.#_db.query(
      `SELECT COUNT (*) FROM ${this.#_name} WHERE ${field} = $1;`,
      [value]
    );
    return parseInt(countObj.count);
  }
}

module.exports.SqlTable = SqlTable;
