const connection = require("../db/connection");
const { TopicsTable } = require("./support/sql/TopicsTable");

module.exports.selectAllTopicsAsync = async () => {
  const topicsTable = new TopicsTable(connection);
  return await topicsTable.selectAllRowsAsync();
};
