const connection = require("../db/connection");
const { TopicsTable } = require("./support/sql/TopicsTable");

module.exports.selectAllTopics = async () => {
  const topicsTable = new TopicsTable(connection);
  return await topicsTable.selectAllRowsAsync();
};
