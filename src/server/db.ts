import { Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME || 'edu_forum';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = parseInt(process.env.DB_PORT || '3306');

console.log(
  `[Database] Đang kết nối tới MySQL: host=${dbHost}, port=${dbPort}, database=${dbName}, user=${dbUser}`,
);

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

let isInitialized = false;

export async function initDatabase() {
  if (isInitialized) return;
  try {
    await sequelize.authenticate();
    console.log('[Database] Kết nối MySQL thành công.');

    // Sử dụng import động để tránh circular dependency
    const { seedDatabase } = await import('./seed');
    await seedDatabase();

    isInitialized = true;
  } catch (error) {
    console.error(
      '[Database] Không thể kết nối tới cơ sở dữ liệu MySQL. Vui lòng kiểm tra lại dịch vụ MySQL local và đảm bảo đã tạo database `edu_forum`. Error:',
      error,
    );
  }
}

export const dbReady = true;
