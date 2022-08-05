const { DBTables } = require("../../globals");
const { SortBySanitiser } = require("./sql-sanitiser");

class ArticlesSortBySanitiser extends SortBySanitiser {
  constructor() {
    super({
      date: DBTables.Articles.Fields.created_at,
      author: DBTables.Articles.Fields.author,
      title: DBTables.Articles.Fields.title,
      topic: DBTables.Articles.Fields.topic,
      votes: DBTables.Articles.Fields.votes,
    });
  }
}

module.exports.ArticlesSortBySanitiser = ArticlesSortBySanitiser;
