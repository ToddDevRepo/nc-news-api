const { DBTables } = require("../../../globals");
const { SqlConfig } = require("./core/SqlConfig");
const { SqlTableDefs } = require("./core/SqlTableDefs");

class CommentsTable extends SqlTableDefs {
  #_queryable;

  constructor(queryable) {
    super(new SqlConfig(DBTables.Comments.name, DBTables.Comments.Fields));
    this.#_queryable = queryable;
  }

  async selectCommentsByArticleId(articleId) {
    return await this.#_queryable.selectAllRowsWhereAsync(
      this.tableName,
      this.fields.article_id,
      articleId
    );
  }

  async insertCommentForArticle(articleId, commentData) {
    return await this.#_queryable.insertColumnValues(
      this.tableName,
      [this.fields.author, this.fields.body, this.fields.article_id],
      [commentData.username, commentData.body, articleId]
    );
  }
}

module.exports.CommentsTable = CommentsTable;
