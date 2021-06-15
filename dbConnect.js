var mysql = require("mysql");

var con = mysql.createConnection({
  //connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DATA_BASE,
});
con.connect(function (err) {
  if (err) throw err;
  console.log("data base Connected!");
});

module.exports = con;
