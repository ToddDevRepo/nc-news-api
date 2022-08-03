const connection = require("../db/connection");
const { articleNotFoundError } = require("../errors");
const { DBTables } = require("../globals");

const gTableName = "articles";

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
  return article;
};
