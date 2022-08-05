const connection = require("../db/connection");
const { DBTables } = require("../globals");

module.exports.selectArticleComments = async (articleId) => {
  console.log("comments model");
  const queryStr = `SELECT *
FROM ${DBTables.Comments.name}
    WHERE ${DBTables.Comments.Fields.article_id} = $1;`;
  const { rows: comments } = await connection.query(queryStr, [articleId]);
  return comments;
};
