// Simple script to generate password hash
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'Admin@123';
  const hash = await bcrypt.hash(password, 10);
  console.log('\n✅ Password hash for "Admin@123":');
  console.log(hash);
  console.log('\nCopy this hash and paste it into MongoDB as passwordHash\n');
}

generateHash();
