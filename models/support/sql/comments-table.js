const { SqlTable } = require("./core/sql-table");

class CommentsTable extends SqlTable {
  #_authorField = "author";

  constructor(db) {
    super(db, "comments");
  }

  async countCommentsByAuthorAsync(author) {
    return await this.countEntriesWhereFieldEqualsAsync(
      this.#_authorField,
      author
    );
  }
}

module.exports.CommentsTable = CommentsTable;
