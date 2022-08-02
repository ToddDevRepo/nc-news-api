const connection = require("../db/connection");

const gTableName = "articles";

module.exports.selectArticleById = async (articleId) => {
  console.log("Model select article by id");
  return await connection.query(
    `SELECT * FROM ${gTableName} WHERE article_id = $1`,
    [articleId]
  );
};
