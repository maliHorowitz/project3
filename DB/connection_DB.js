var mysql = require('mysql2');
import dotenv from 'dotenv';
dotenv.config();
var con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

con.connect(function(err) {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }
    console.log("Connected to DB!");
  
    // con.query("CREATE DATABASE mydb", function(err, result) {
    //   if (err) {
    //     console.error("Error creating database:", err);
    //     return;
    //   }
    //   console.log("Database created");
    // });
    var sql = `
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(255), 
      password VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(255))`;
    con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
  });