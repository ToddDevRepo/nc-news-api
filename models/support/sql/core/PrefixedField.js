class PrefixedField {
  #_tableName;

  constructor(tableName, fields) {
    this.#_tableName = tableName;
    this.#_addFieldsAsProperties(fields);
  }

  #_addFieldsAsProperties(fields) {
    for (const fieldKey in fields) {
      Object.defineProperty(this, fieldKey, {
        get: () => {
          return `${this.#_tableName}.${fields[fieldKey]}`;
        },
      });
    }
  }

  get all() {
    return `${this.#_tableName}.*`;
  }
}

module.exports.PrefixedField = PrefixedField;
