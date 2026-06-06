/**
 * Kết nối MySQL — Sequelize (sẽ kích hoạt khi có biến môi trường DB).
 * @todo Cấu hình DATABASE_URL trong .env
 */

// import { Sequelize } from 'sequelize';

// export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
//   dialect: 'mysql',
//   logging: process.env.NODE_ENV === 'development' ? console.log : false,
// });

export const dbReady = false;
