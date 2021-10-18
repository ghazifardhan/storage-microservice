import mysql from 'mysql';
import dotenv from 'dotenv';
import { Environtment } from "./src/interfaces/env";

// load env
const envUnparsed = dotenv.config();
export const env = (): Environtment => {
  return {
    API_NAME: envUnparsed.parsed!.API_NAME,
    API_VERSION: envUnparsed.parsed!.API_VERSION,
    API_VERSION_PATH: envUnparsed.parsed!.API_VERSION_PATH,
    DB_HOST: envUnparsed.parsed!.DB_HOST,
    DB_NAME: envUnparsed.parsed!.DB_NAME,
    DB_USER: envUnparsed.parsed!.DB_USER,
    DB_PASS: envUnparsed.parsed!.DB_PASS
  }
}

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