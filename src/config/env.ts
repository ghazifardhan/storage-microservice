import dotenv from "dotenv";
import { Environtment } from "../interfaces/env";

// load env
const envUnparsed = dotenv.config();
export const env = (): Environtment => {
  // return {
  //   API_NAME: envUnparsed.parsed!.API_NAME,
  //   API_VERSION: envUnparsed.parsed!.API_VERSION,
  //   API_VERSION_PATH: envUnparsed.parsed!.API_VERSION_PATH,
  //   DB_HOST: envUnparsed.parsed!.DB_HOST,
  //   DB_NAME: envUnparsed.parsed!.DB_NAME,
  //   DB_USER: envUnparsed.parsed!.DB_USER,
  //   DB_PASS: envUnparsed.parsed!.DB_PASS,
  //   APP_URL: envUnparsed.parsed!.APP_URL,
  //   API_ASSETS_PATH: envUnparsed.parsed!.API_ASSETS_PATH,
  //   API_STORAGE_PATH: envUnparsed.parsed!.API_STORAGE_PATH,
  //   API_DOWNLOADS_PATH: envUnparsed.parsed!.API_DOWNLOADS_PATH,
  // }
  return {
    API_NAME: process.env.API_NAME,
    API_VERSION: process.env.API_VERSION,
    API_VERSION_PATH: process.env.API_VERSION_PATH,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    APP_URL: process.env.APP_URL,
    API_ASSETS_PATH: process.env.API_ASSETS_PATH,
    API_STORAGE_PATH: process.env.API_STORAGE_PATH,
    API_DOWNLOADS_PATH: process.env.API_DOWNLOADS_PATH,
  };
};
