import mysql from 'mysql';
import { env } from './src/server';

const conn = mysql.createConnection({
  host: env().DB_HOST,
  user: env().DB_USER,
  password: env().DB_PASS
});

conn.connect((err) => {
  if (err) throw err;

  console.log('Connected');
  conn.query(`CREATE DATABASE ${env().DB_NAME}`, (err, result) => {
    if (err) throw err;

    return console.log("Database created");
  })
});