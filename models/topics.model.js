const connection = require("../db/connection");
const { TopicsTable } = require("./support/sql/TopicsTable");

module.exports.selectAllTopics = () => {
  const topicsTable = new TopicsTable(connection);
  return topicsTable.selectAll();
};
