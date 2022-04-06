const pgp = require("pg-promise")();
const dotenv = require("dotenv");
require("dotenv").config();

const db = pgp(`postgres://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:5432/${process.env.DATABASE}`);

module.exports = db;


