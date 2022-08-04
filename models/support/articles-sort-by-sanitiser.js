const { DBTables } = require("../../globals");
const { SortBySanitiser } = require("./sql-sanitiser");

class ArticlesSortBySanitiser extends SortBySanitiser {
  constructor() {
    super({ date: DBTables.Articles.Fields.created_at });
  }
}

module.exports.ArticlesSortBySanitiser = ArticlesSortBySanitiser;
