const connection = require("../db/connection");
const { CommentsTable } = require("./support/sql/comments-table");

module.exports.countCommentsByAuthorAsync = async (author) => {
  const commentsTable = new CommentsTable(connection);
  return await commentsTable.countCommentsByAuthorAsync(author);
};
