import { Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME || 'edu_forum';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD ?? '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

console.log(
  `[Database] Đang kết nối tới MySQL: host=${dbHost}, port=${dbPort}, database=${dbName}, user=${dbUser}`,
);

// MySQL cloud (TiDB Cloud, Aiven, PlanetScale...) bắt buộc SSL — bật bằng env DB_SSL=true
const useSsl = process.env.DB_SSL === 'true';

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: useSsl
    ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } }
    : {},
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

let isInitialized = false;
let initPromise: Promise<void> | null = null;

export async function initDatabase() {
  if (isInitialized) return;

  // Chống race: nhiều request đầu tiên đến cùng lúc chỉ init/seed MỘT lần
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await sequelize.authenticate();
        console.log('[Database] Kết nối MySQL thành công.');

        // Sử dụng import động để tránh circular dependency
        const { seedDatabase } = await import('./seed');
        await seedDatabase();

        isInitialized = true;
      } catch (error) {
        // Cho phép request sau thử kết nối lại
        initPromise = null;
        console.error(
          '[Database] Không thể kết nối tới cơ sở dữ liệu MySQL. Vui lòng kiểm tra lại dịch vụ MySQL local và đảm bảo đã tạo database `edu_forum`. Error:',
          error,
        );
      }
    })();
  }

  return initPromise;
}
