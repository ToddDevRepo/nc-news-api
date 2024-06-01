const { DBTableDefs } = require('../../../globals');
const { SqlConfig } = require('./core/SqlConfig');
const { BaseSqlTable } = require('./core/BaseSqlTable');

class TopicsTable extends BaseSqlTable {
  #_queryable;

  constructor(queryable) {
    super(new SqlConfig(DBTableDefs.Topics.name, DBTableDefs.Topics.Fields));
    this.#_queryable = queryable;
  }

  async selectAllTopicsAsync() {
    return await this.#_queryable.selectAllRowsAsync(this.tableName);
  }
}

module.exports.TopicsTable = TopicsTable;
