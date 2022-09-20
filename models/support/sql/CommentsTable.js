const { DBTables } = require("../../../globals");
const { SqlConfig } = require("./core/SqlConfig");
const { SqlTableDefs } = require("./core/SqlTableDefs");

class CommentsTable extends SqlTableDefs {
  #_queryable;

  constructor(queryable) {
    super(new SqlConfig(DBTables.Comments.name, DBTables.Comments.Fields));
    this.#_queryable = queryable;
  }
}

module.exports.CommentsTable = CommentsTable;
