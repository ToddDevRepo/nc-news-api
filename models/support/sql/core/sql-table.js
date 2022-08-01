const format = require("pg-format");
const { SqlQueryBuilder } = require("./query-builder");

class SqlTable {
  #_db;
  #_tableConfig;
  #_queryBuilder;

  constructor(db, tableConfig) {
    this.#_db = db;
    this.#_tableConfig = tableConfig;
    this.#_queryBuilder = new SqlQueryBuilder(db);
  }

  get name() {
    return this.#_tableConfig.name;
  }

  insert(items) {
    if (!Array.isArray(items)) items = [items];
    const sqlFields = `(${this.#_tableConfig.fields.join(", ")})`;
    const valuesArray = this._items2ValuesArray(items);
    const sqlQuery = format(
      `INSERT INTO ${this.#_tableConfig.name} ${sqlFields} VALUES %L;`,
      valuesArray
    );
    return this.#_db.query(sqlQuery);
  }

  buildSelectAll() {
    return this.#_queryBuilder.selectAll().from(this.name);
  }

  update() {}

  // Private Methods
  _items2ValuesArray(items) {
    const result = [];
    items.forEach((item) => {
      result.push(this.#_tableConfig.fields.map((field) => item[field]));
    });
    return result;
  }
}

module.exports.SqlTable = SqlTable;
