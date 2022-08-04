const connection = require("../db/connection");
const { DBTables } = require("../globals");

module.exports.selectAllTopics = () => {
  return connection.query(`SELECT * FROM ${DBTables.Topics.name};`);
};
