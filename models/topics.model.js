const connection = require("../db/connection");

const gTableName = "topics";
module.exports.selectAllTopics = () => {
  return connection.query(`SELECT * FROM ${gTableName};`);
};
