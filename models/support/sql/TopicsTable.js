const { DBTables } = require("../../../globals");
const { SqlConfig } = require("./core/SqlConfig");
const { SqlTableDefs } = require("./core/SqlTableDefs");

class TopicsTable extends SqlTableDefs {
  #_queryable;

  constructor(queryable) {
    super(new SqlConfig(DBTables.Topics.name, DBTables.Topics.Fields));
    this.#_queryable = queryable;
  }

  async selectAllTopicsAsync() {
    return await this.#_queryable.selectAllRowsAsync(this.tableName);
  }
}

module.exports.TopicsTable = TopicsTable;
