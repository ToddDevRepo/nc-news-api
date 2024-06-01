const { DBTableDefs } = require('../../../globals');
const { SqlConfig } = require('./core/SqlConfig');
const { BaseSqlTable } = require('./core/BaseSqlTable');

class CommentsTable extends BaseSqlTable {
  constructor(queryHelper) {
    super(
      queryHelper,
      new SqlConfig(DBTableDefs.Comments.name, DBTableDefs.Comments.Fields)
    );
  }

  async selectCommentsByArticleId(articleId) {
    return await this.queryHelper.selectAllRowsWhereAsync(
      this.tableName,
      this.fields.article_id,
      articleId
    );
  }

  async insertCommentForArticle(articleId, commentData) {
    return await this.queryHelper.insertColumnValuesAsync(
      this.tableName,
      [this.fields.author, this.fields.body, this.fields.article_id],
      [commentData.username, commentData.body, articleId]
    );
  }

  async deleteCommentByIdAsync(commentId) {
    return await this.queryHelper.deleteItemWhereAsync(
      this.tableName,
      this.fields.id,
      commentId
    );
  }
}

module.exports.CommentsTable = CommentsTable;
