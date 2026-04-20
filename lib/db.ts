// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   port: Number(process.env.DB_PORT),
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'smart_attend',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   ssl: { rejectUnauthorized: false },
// });

// export default pool;

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export async function query<T = unknown>(sql: string, params?: any[]): Promise<T> {
//   const [rows] = await pool.execute(sql, params);
//   return rows as T;
// }



import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

// export async function query(sql, params) {
//   const [rows] = await pool.execute(sql, params);
//   return rows;
// }

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
