class SortBySanitiser {
  #_sortByFields;
  constructor(sortByFields) {
    this.#_sortByFields = sortByFields;
  }

  isValidOrder(order) {
    return ['desc', 'asc'].includes(order.toLowerCase());
  }

  sanitiseSortByField(sortByField) {
    sortByField = sortByField.toLowerCase();
    return this.#_sortByFields[sortByField];
  }
}

module.exports.SortBySanitiser = SortBySanitiser;
