const { SqlTable } = require("./core/sql-table");

class SqlTopicsTable extends SqlTable {
  constructor(db) {
    super(db, { name: "topics", fields: ["slug", "description"] });
  }

  selectAllTopics() {
    return this.buildSelectAll().send();
  }
}

module.exports.SqlTopicsTable = SqlTopicsTable;
