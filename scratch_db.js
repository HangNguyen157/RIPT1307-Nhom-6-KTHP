const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '2542006',
    database: 'edu_forum'
  });

  try {
    // 1. Update giangvien to teacher
    const [res1] = await connection.query("UPDATE Users SET role = 'teacher' WHERE role = 'giangvien'");
    console.log('Updated giangvien:', res1.affectedRows);

    // 2. Update sinhvien to student
    const [res2] = await connection.query("UPDATE Users SET role = 'student' WHERE role = 'sinhvien'");
    console.log('Updated sinhvien:', res2.affectedRows);

    // 3. Select all to verify
    const [rows] = await connection.query('SELECT id, name, email, role FROM Users');
    console.log('--- Current Users in DB ---');
    console.log(rows);
  } catch (error) {
    console.error('Error cleaning up Users roles:', error);
  } finally {
    await connection.end();
  }
}

run();
