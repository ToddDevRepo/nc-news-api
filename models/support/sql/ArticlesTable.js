const { DBTables } = require("../../../globals");
const { SqlConfig } = require("./core/SqlConfig");
const { SqlTable } = require("./core/SqlTable");

class ArticlesTable extends SqlTable {
  constructor(db) {
    super(db, new SqlConfig(DBTables.Articles.name, DBTables.Articles.Fields));
  }

  async getArticleByIdWithCommentCountAsync(id, commentsTable) {
    const commentCountField = "comment_count";
    return await this.queryForItemAsync(
      `SELECT ${this.prefixedField.all}, 
      COUNT(${commentsTable.fields.id}) AS ${commentCountField}
FROM ${this.tableName}
LEFT JOIN ${commentsTable.tableName}
ON ${this.prefixedField.id}=${commentsTable.prefixedField.article_id}
WHERE ${this.prefixedField.id} = $1
GROUP BY ${this.prefixedField.id};`,
      [id]
    );
  }
}

module.exports.ArticlesTable = ArticlesTable;
