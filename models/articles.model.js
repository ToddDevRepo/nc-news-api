const connection = require("../db/connection");
const { articleNotFoundError } = require("../errors");

const gTableName = "articles";

module.exports.selectArticleById = async (articleId) => {
  const { rows: articleInArray } = await connection.query(
    `SELECT * FROM ${gTableName} WHERE article_id = $1`,
    [articleId]
  );
  if (articleInArray.length === 0) return Promise.reject(articleNotFoundError);
  return articleInArray[0];
};
