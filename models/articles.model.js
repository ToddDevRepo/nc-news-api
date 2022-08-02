const connection = require("../db/connection");
const { articleNotFoundError } = require("../errors");

const gTableName = "articles";

module.exports.selectArticleById = async (articleId) => {
  const {
    rows: [article],
  } = await connection.query(
    `SELECT * FROM ${gTableName} WHERE article_id = $1`,
    [articleId]
  );
  if (!article) return Promise.reject(articleNotFoundError);
  return article;
};
