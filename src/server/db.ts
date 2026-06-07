/**
 * Sequelize MySQL initialization.
 * Reads connection from env vars and exports `sequelize` and `initDb`.
 */

import { Sequelize } from 'sequelize';

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_NAME = 'forum_ptit_enterprise_db',
  DB_USER = 'root',
  DB_PASSWORD = '',
  NODE_ENV = 'development',
  DB_SYNC = 'false',
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'mysql',
  logging: NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    freezeTableName: true,
  },
});

export async function initDb(options?: { sync?: boolean }) {
  await sequelize.authenticate();
  const shouldSync = options?.sync ?? DB_SYNC === 'true';
  if (shouldSync) {
    await sequelize.sync({ alter: false });
  }
}

export const dbReady = true;
