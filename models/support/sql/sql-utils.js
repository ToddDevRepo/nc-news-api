const connection = require("../../../db/connection");
const { SqlQueryHelper } = require("./core/SqlQueriyHelper");

module.exports.gSqlQueryHelper = new SqlQueryHelper(connection);
