const { DBTableDefs } = require('../../../globals');
const { SqlConfig } = require('./core/SqlConfig');
const { BaseSqlTable } = require('./core/BaseSqlTable');

class TopicsTable extends BaseSqlTable {
  constructor(queryHelper) {
    super(
      queryHelper,
      new SqlConfig(DBTableDefs.Topics.name, DBTableDefs.Topics.Fields)
    );
  }

  async selectAllTopicsAsync() {
    return await this.queryHelper.selectAllRowsAsync(this.tableName);
  }
}

module.exports.TopicsTable = TopicsTable;
