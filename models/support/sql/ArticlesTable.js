const { DBTableDefs, QueryTypes } = require('../../../globals');
const { SortBySanitiser } = require('./core/sql-sanitiser');
const { SqlConfig } = require('./core/SqlConfig');
const { BaseSqlTable } = require('./core/BaseSqlTable');

class ArticlesTable extends BaseSqlTable {
  static #_commentCountField = 'comment_count';
  #_queryHelper;
  #_sortBySanitizer;

  constructor(queryHelper) {
    super(
      new SqlConfig(DBTableDefs.Articles.name, DBTableDefs.Articles.Fields)
    );
    this.#_queryHelper = queryHelper;
    const sortableFields = {
      date: this.fields.created_at,
      author: this.fields.author,
      title: this.fields.title,
      topic: this.fields.topic,
      votes: this.fields.votes,
      comment_count: ArticlesTable.#_commentCountField,
    };
    this.#_sortBySanitizer = new SortBySanitiser(sortableFields);
  }

  get sortSanitizer() {
    return this.#_sortBySanitizer;
  }

  async getArticleByIdWithCommentCountAsync(id, commentsTable) {
    return await this.#_queryHelper.queryForItemAsync(
      `SELECT ${this.prefixedField.all}, 
      COUNT(${commentsTable.fields.id})::INTEGER AS ${
        ArticlesTable.#_commentCountField
      }
FROM ${this.tableName}
LEFT JOIN ${commentsTable.tableName}
ON ${this.prefixedField.id}=${commentsTable.prefixedField.article_id}
WHERE ${this.prefixedField.id} = $1
GROUP BY ${this.prefixedField.id};`,
      [id]
    );
  }

  async updateArticleVotesAsync(articleId, newVotes) {
    return await this.#_queryHelper.queryForItemAsync(
      `UPDATE ${this.tableName}
    SET ${this.fields.votes} = votes + $1
    WHERE ${this.fields.id} = $2 RETURNING *;`,
      [newVotes, articleId]
    );
  }

  async selectSortedArticlesByFilterAsync(
    filter,
    sortBy,
    order,
    commentsTable
  ) {
    const queryInfo = this.#_createFilteredArticlesQuery(
      filter,
      sortBy,
      order,
      commentsTable
    );
    return await this.#_queryHelper.queryForRowsAsync(
      queryInfo.sql,
      queryInfo.params
    );
  }

  #_createFilteredArticlesQuery(filter, sortBy, order, commentsTable) {
    let querySql = `SELECT 
      ${this.prefixedField.id},
      ${this.prefixedField.title},
      ${this.prefixedField.topic},
      ${this.prefixedField.author},
      ${this.prefixedField.created_at},
       ${this.prefixedField.votes},
       CAST(COUNT(${commentsTable.prefixedField.id}) AS INT) AS ${
      ArticlesTable.#_commentCountField
    }
    FROM ${this.tableName}
    LEFT JOIN ${commentsTable.tableName}
    ON ${this.prefixedField.id}=${commentsTable.prefixedField.article_id}`;
    const queryParams = [];

    if (filter) {
      querySql += ` WHERE ${QueryTypes.topic} = $1`;
      queryParams.push(filter);
    }
    querySql += ` GROUP BY ${this.prefixedField.id}`;
    if (sortBy && order) querySql += ` ORDER BY ${sortBy} ${order}`;
    querySql += ';';
    return { sql: querySql, params: queryParams };
  }
}

module.exports.ArticlesTable = ArticlesTable;
