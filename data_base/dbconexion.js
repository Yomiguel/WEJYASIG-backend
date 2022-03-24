const pgp = require("pg-promise")();
const db = pgp(
  "postgres://postgres:postgres@database-1.cj189klt7leg.us-east-1.rds.amazonaws.com:5432/proyecto"
);

module.exports = db;
