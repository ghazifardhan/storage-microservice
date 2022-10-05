import mysql from 'mysql';
import { exit } from 'process';
import { env } from './src/config/env';

const conn = mysql.createConnection({
  host: env().DB_HOST,
  user: env().DB_USER,
  password: env().DB_PASS
});

conn.connect(async (err) => {
  if (err) throw err;

  console.log('Connected');
  conn.query(`CREATE DATABASE IF NOT EXISTS ${env().DB_NAME}`, (err, result) => {
    console.log("test");
    if (err) throw err;
    console.log("Database created");
    exit();
  });
});