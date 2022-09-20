const { DBTables } = require("../../../globals");
const { SqlConfig } = require("./core/SqlConfig");
const { SqlTableDefs } = require("./core/SqlTableDefs");

class ArticlesTable extends SqlTableDefs {
  #_queryable;

  constructor(queryable) {
    super(new SqlConfig(DBTables.Articles.name, DBTables.Articles.Fields));
    this.#_queryable = queryable;
  }

  async getArticleByIdWithCommentCountAsync(id, commentsTable) {
    const commentCountField = "comment_count";
    return await this.#_queryable.queryForItemAsync(
      `SELECT ${this.prefixedField.all}, 
      COUNT(${commentsTable.fields.id})::INTEGER AS ${commentCountField}
FROM ${this.tableName}
LEFT JOIN ${commentsTable.tableName}
ON ${this.prefixedField.id}=${commentsTable.prefixedField.article_id}
WHERE ${this.prefixedField.id} = $1
GROUP BY ${this.prefixedField.id};`,
      [id]
    );
  }

  async updateArticleVotesAsync(articleId, incVotes) {
    return await this.#_queryable.queryForItemAsync(
      `UPDATE ${this.tableName}
    SET ${this.fields.votes} = votes + $1
    WHERE ${this.fields.id} = $2 RETURNING *;`,
      [incVotes, articleId]
    );
  }
}

module.exports.ArticlesTable = ArticlesTable;
