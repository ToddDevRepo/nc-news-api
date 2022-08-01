class SqlTopicsTable {
  #_db;
  #_name = "topics";

  constructor(db) {
    this.#_db = db;
  }

  selectAllTopics() {
    return this.#_db.query(`SELECT * FROM ${this.#_name};`);
  }
}

module.exports.SqlTopicsTable = SqlTopicsTable;
