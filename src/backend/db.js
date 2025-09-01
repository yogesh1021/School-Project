import mysql from 'mysql2/promise';

const g = globalThis;

export function getDBPool() {
  if (!g._mysqlPool) {
    g._mysqlPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      enableKeepAlive: true,
    });
    console.log("MySQL pool created");
  }
  return g._mysqlPool;
}