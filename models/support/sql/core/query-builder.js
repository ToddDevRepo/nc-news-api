class SqlQueryBuilder {
  #_db;
  #_queryParts = [];
  #operands = [];

  constructor(db) {
    this.#_db = db;
  }

  select(fields) {
    if (Array.isArray(fields)) fields = fields.join(", ");
    this.#_queryParts = [];
    this.#_queryParts.push("SELECT", fields);
    return this;
  }

  selectAll() {
    return this.select("*");
  }

  from(table) {
    this.#_queryParts.push("FROM", table);
    return this;
  }

  where(field) {
    this.#operands = [];
    this.#_queryParts.push("WHERE", field);
    return this;
  }

  and(field) {
    this.#_queryParts.push("AND", field);
    return this;
  }
  or(field) {
    this.#_queryParts.push("OR", field);
    return this;
  }

  eq(operand) {
    this.#operands.push(operand);
    this.#_queryParts.push("=", `$${this.#operands.length}`);
    return this;
  }

  neq(operand) {
    this.#operands.push(operand);
    this.#_queryParts.push("<>", `$${this.#operands.length}`);
    return this;
  }

  gt(operand) {
    this.#operands.push(operand);
    this.#_queryParts.push(">", `$${this.#operands.length}`);
    return this;
  }

  send() {
    const sql = this.#_queryParts.join(" ");
    const operands = this.#operands;
    this.#_queryParts = [];
    this.#operands = [];
    if (operands.length === 0) return this.#_db.query(`${sql};`);
    return this.#_db.query(`${sql};`, operands);
  }
}

module.exports.SqlQueryBuilder = SqlQueryBuilder;
