class SortBySanitiser {
  #_lookupTable;
  constructor(lookupTable) {
    this.#_lookupTable = lookupTable;
  }

  isValidOrder(order) {
    return ['desc', 'asc'].includes(order.toLowerCase());
  }

  sanitiseSortByField(sortByField) {
    sortByField = sortByField.toLowerCase();
    return this.#_lookupTable[sortByField];
  }
}

module.exports.SortBySanitiser = SortBySanitiser;
