class SortBySanitiser {
  #_lookupTable;
  constructor(lookupTable) {
    this.#_lookupTable = lookupTable;
  }

  isValidOrder(order) {
    return ['desc', 'asc'].includes(order.toLowerCase());
  }

  sanitiseSortBy(sortBy) {
    sortBy = sortBy.toLowerCase();
    return this.#_lookupTable[sortBy];
  }
}

module.exports.SortBySanitiser = SortBySanitiser;
