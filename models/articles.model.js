const connection = require("../db/connection");
const { articleNotFoundError } = require("../errors");
const { DBTables } = require("../globals");

module.exports.selectArticleById = async (articleId) => {
  const commentCountField = "comment_count";
  const {
    rows: [article],
  } = await connection.query(
    `SELECT ${DBTables.Articles.name}.*, COUNT(${DBTables.Comments.Fields.id}) AS ${commentCountField}
FROM ${DBTables.Articles.name}
RIGHT JOIN ${DBTables.Comments.name} ON ${DBTables.Comments.name}.${DBTables.Comments.Fields.author} = ${DBTables.Articles.name}.${DBTables.Articles.Fields.author}
WHERE ${DBTables.Articles.name}.${DBTables.Articles.Fields.id} = $1
GROUP BY ${DBTables.Articles.name}.${DBTables.Articles.Fields.id};`,
    [articleId]
  );

  if (!article) return Promise.reject(articleNotFoundError);
  article[commentCountField] = parseInt(article[commentCountField]);
  return article;
};

module.exports.updateArticleVotes = async (article_id, newVotes) => {
  console.log("Model increment votes");
  const {
    rows: [result],
  } = await connection.query(
    `UPDATE ${DBTables.Articles.name}
    SET ${DBTables.Articles.Fields.votes} = ${newVotes}
    WHERE ${DBTables.Articles.Fields.id} = $1 RETURNING *;`,
    [article_id]
  );
  return result;
};
