const bcrypt = require('bcryptjs');

// Define test users with their passwords
const testUsers = [
  { username: 'admin', password: 'admin123' },
  { username: 'arnab', password: 'arnab123' },
  { username: 'ritwij', password: 'ritwij123' },
  { username: 'durbasmriti', password: 'durbasmriti123' },
  { username: 'pallavi', password: 'pallavi123' },
  { username: 'jyothika', password: 'jyothika123' },
  { username: 'aayushman', password: 'aayushman123' },
  { username: 'arnav', password: 'arnav123' },
  { username: 'satyarth', password: 'satyarth123' },
  { username: 'shreya', password: 'shreya123' },
  { username: 'tanmay', password: 'tanmay123' },
  { username: 'priyanshu', password: 'priyanshu123' },
  { username: 'ananya', password: 'ananya123' },
  { username: 'philip', password: 'philip123' },
  { username: 'sudharsana', password: 'sudharsana123' },
  { username: 'baswana', password: 'baswana123' },
  { username: 'preeti', password: 'preeti123' },
  { username: 'gayathri', password: 'gayathri123' },
  { username: 'manas', password: 'manas123' },
  { username: 'sneha', password: 'sneha123' },
];

// Generate hashes
async function generateHashes() {
  console.log('Bcrypt hashes for test users:\n');
  console.log('Username\t\tPassword\t\tHash');
  console.log('--------\t\t--------\t\t----');
  
  for (const user of testUsers) {
    const hash = await bcrypt.hash(user.password, 10);
    console.log(`${user.username}\t\t${user.password}\t\t${hash}`);
  }
}

generateHashes();
