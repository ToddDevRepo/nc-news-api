const connection = require("../db/connection");
const { SqlTopicsTable } = require("./support/sql/sql-topics-table");

module.exports.selectAllTopics = () => {
  const topicsTable = new SqlTopicsTable(connection);
  return topicsTable.selectAllTopics();
};
