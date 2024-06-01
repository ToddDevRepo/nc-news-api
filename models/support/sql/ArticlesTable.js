const { DBTables, QueryTypes } = require('../../../globals');
const { SortBySanitiser } = require('./core/sql-sanitiser');
const { SqlConfig } = require('./core/SqlConfig');
const { BaseSqlTable } = require('./core/BaseSqlTable');

class ArticlesTable extends BaseSqlTable {
  static #_commentCountField = 'comment_count';
  #_queryHelper;
  #_sortBySanitizer;

  constructor(queryHelper) {
    super(new SqlConfig(DBTables.Articles.name, DBTables.Articles.Fields));
    this.#_queryHelper = queryHelper;
    this.#_sortBySanitizer = new SortBySanitiser({
      date: this.fields.created_at,
      author: this.fields.author,
      title: this.fields.title,
      topic: this.fields.topic,
      votes: this.fields.votes,
      comment_count: ArticlesTable.#_commentCountField,
    });
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

  async updateArticleVotesAsync(articleId, incVotes) {
    return await this.#_queryHelper.queryForItemAsync(
      `UPDATE ${this.tableName}
    SET ${this.fields.votes} = votes + $1
    WHERE ${this.fields.id} = $2 RETURNING *;`,
      [incVotes, articleId]
    );
  }

  async selectSortedArticlesByFilterAsync(
    filter,
    sortBy,
    order,
    commentsTable
  ) {
    const sqlInfo = this.#_createFilteredArticlesQuery(
      filter,
      sortBy,
      order,
      commentsTable
    );
    //console.log(sqlInfo.str);
    return await this.#_queryHelper.queryForRowsAsync(
      sqlInfo.str,
      sqlInfo.args
    );
  }

  #_createFilteredArticlesQuery(filter, sortBy, order, commentsTable) {
    const queryArgs = [];
    let queryStr = `SELECT 
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
    if (filter) {
      queryStr += ` WHERE ${QueryTypes.topic} = $1`;
      queryArgs.push(filter);
    }
    queryStr += ` GROUP BY ${this.prefixedField.id}`;
    if (sortBy && order) queryStr += ` ORDER BY ${sortBy} ${order}`;
    queryStr += ';';
    return { str: queryStr, args: queryArgs };
  }
}

module.exports.ArticlesTable = ArticlesTable;
