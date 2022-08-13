const { DBTables } = require("../../../globals");
const { SqlConfig } = require("./core/SqlConfig");
const { SqlTable } = require("./core/SqlTable");

class TopicsTable extends SqlTable {
  constructor(db) {
    super(db, new SqlConfig(DBTables.Topics.name));
  }
}

module.exports.TopicsTable = TopicsTable;
