const connection = require("../db/connection");
const { CommentsTable } = require("./support/sql/comments-table");

const gTableName = "comments";
const gAuthorField = "author";

module.exports.countCommentsByAuthorAsync = async (author) => {
  const {
    rows: [countObj],
  } = await connection.query(
    `SELECT COUNT (*) FROM ${gTableName} WHERE ${gAuthorField} = $1;`,
    [author]
  );
  return parseInt(countObj.count);
};
