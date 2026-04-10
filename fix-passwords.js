const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function fix() {
  const hash = await bcrypt.hash('password123', 10);
  console.log('Hash:', hash);

  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sanket@2005',  // ← change this
    database: 'smart_attend',
  });

  await conn.execute('UPDATE users SET password = ?', [hash]);
  console.log('✅ Passwords updated');
  await conn.end();
}
fix().catch(console.error);