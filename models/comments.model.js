const connection = require("../db/connection");
const { DBTables } = require("../globals");
const { selectArticleById } = require("./articles.model");

module.exports.selectArticleComments = async (articleId) => {
  const articleExistsPending = selectArticleById(articleId);
  const getCommentsPending = connection.query(
    `SELECT *
    FROM ${DBTables.Comments.name}
    WHERE ${DBTables.Comments.Fields.article_id} = $1;`,
    [articleId]
  );
  const result = await Promise.all([getCommentsPending, articleExistsPending]);
  const { rows: comments } = result[0];
  return comments;
};
