const { DBTables } = require("../../../globals");
const { SqlConfig } = require("./core/SqlConfig");
const { SqlTable } = require("./core/SqlTable");

class CommentsTable extends SqlTable {
  constructor(db) {
    super(db, new SqlConfig(DBTables.Comments.name, DBTables.Comments.Fields));
  }
}

module.exports.CommentsTable = CommentsTable;
