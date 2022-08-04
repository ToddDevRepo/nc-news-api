class SqlSanitiser {
  isInvalidOrder(order) {
    return !["desc", "asc"].includes(order.toLowerCase());
  }
}

module.exports.SqlSanitiser = SqlSanitiser;
