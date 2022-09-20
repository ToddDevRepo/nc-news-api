const { gSqlQueryHelper } = require("./support/sql/sql-utils");
const { TopicsTable } = require("./support/sql/TopicsTable");

module.exports.selectAllTopicsAsync = async () => {
  const topicsTable = new TopicsTable(gSqlQueryHelper);
  return await topicsTable.selectAllTopicsAsync();
};
