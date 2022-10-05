import mysql from 'mysql';
import { exit } from 'process';
import { env } from './src/config/env';

const conn = mysql.createConnection({
  host: env().DB_HOST,
  user: env().DB_USER,
  password: env().DB_PASS,
  database: env().DB_NAME
});

conn.connect((err) => {
  if (err) throw err;

  const appKeyTable = "CREATE TABLE IF NOT EXISTS `app_keys` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `secret` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8";
  const storageTable = "CREATE TABLE IF NOT EXISTS `storages` (`id` varchar(36) NOT NULL, `fieldName` varchar(255) NOT NULL,`originalName` varchar(255) NOT NULL, `encoding` varchar(255) NOT NULL, `mimetype` varchar(255) NOT NULL, `destination` varchar(255) NOT NULL, `filename` varchar(255) NOT NULL, `path` varchar(255) NOT NULL, `size` int(11) NOT NULL, `thumbnail` varchar(255) NOT NULL DEFAULT '', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8";
  const alterTableAppKeyCreatedAt = "ALTER TABLE `app_keys` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)";
  const alterTableAppKeyUpdatedAt = "ALTER TABLE `app_keys` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)";
  const alterTableAppKeyDeletedAt = "ALTER TABLE `app_keys` ADD `deletedAt` datetime(6) DEFAULT NULL";
  const alterTableStorageCreatedAt = "ALTER TABLE `storages` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)";
  const alterTableStorageUpdatedAt = "ALTER TABLE `storages` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)";
  const alterTableStorageDeletedAt = "ALTER TABLE `storages` ADD `deletedAt` datetime(6) DEFAULT NULL";

  conn.query(appKeyTable, (err, result) => {
    if (err) {
      console.log('Table `app_keys` already exists');
    }
    console.log("Table `app_keys` created");
  });

  conn.query(storageTable, (err, result) => {
    if (err) {
      console.log('Table `storages` already exists');
    }
    console.log("Table `storages` created");
  });

  conn.query(alterTableAppKeyCreatedAt, (err, result) => {
    if (err) {
      console.log("Alter table `app_keys.createdAt` already exists");
    }
    console.log("Alter table `app_keys.createdAt` created");
  });
  conn.query(alterTableAppKeyUpdatedAt, (err, result) => {
    if (err) {
      console.log("Alter table `app_keys.updatedAt` already exists");
    }
    console.log("Alter table `app_keys.updatedAt` created");
  });
  conn.query(alterTableAppKeyDeletedAt, (err, result) => {
    if (err) {
      console.log("Alter table `app_keys.deletedAt` already exists");
    }
    console.log("Alter table `app_keys.deletedAt` created");
  });

  conn.query(alterTableStorageCreatedAt, (err, result) => {
    if (err) {
      console.log("Alter table `storages.createdAt` already exists");
    }
    console.log("Alter table `storages.createdAt` created");
  });
  conn.query(alterTableStorageUpdatedAt, (err, result) => {
    if (err) {
      console.log("Alter table `storages.updatedAt` already exists");
    }
    console.log("Alter table `storages.updatedAt` created");
  });
  conn.query(alterTableStorageDeletedAt, (err, result) => {
    if (err) {
      console.log("Alter table `storages.deletedAt` already exists");
    }
    console.log("Alter table `storages.deletedAt` created");
  });

  setTimeout(() => {
    exit();
  }, 5000);
});