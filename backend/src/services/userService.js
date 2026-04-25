const { getPool } = require('../db/pool');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ALLOWED_LOGIN_IDS = new Set([
  'admin',
  'arnab',
  'ritwij',
  'durbasmriti',
  'pallavi',
  'jyothika',
  'aayushman',
]);

const getUserProfile = async (userId) => {
  const pool = getPool();
  
  // 1. Get base user
  const [userRows] = await pool.query(
    'SELECT user_id, username, email, role FROM users WHERE user_id = ?', 
    [userId]
  );

  if (userRows.length === 0) return null;
  const user = userRows[0];

  // 2. Decorate with profile data
  let details = [];
  if (user.role === 'student') {
    [details] = await pool.query(
      'SELECT name, roll_no, department, academic_year, cpi FROM student_profiles WHERE user_id = ?',
      [userId]
    );
  } else if (user.role === 'professor') {
    [details] = await pool.query(
      'SELECT name, department FROM professor_profiles WHERE user_id = ?',
      [userId]
    );
  }

  return { ...user, ...(details[0] || {}) };
};

const loginUser = async (username, password) => {
  const pool = getPool();
  const normalizedUsername = String(username || '').trim().toLowerCase();

  if (!ALLOWED_LOGIN_IDS.has(normalizedUsername)) {
    throw new Error('Invalid username or password');
  }

  // 1. Check if user exists
  const [userRows] = await pool.query(
    'SELECT user_id, username, email, password_hash, role, is_active FROM users WHERE LOWER(username) = ?',
    [normalizedUsername]
  );

  if (userRows.length === 0) {
    throw new Error('Invalid username or password');
  }

  const user = userRows[0];

  // 2. Check if user is active
  if (!user.is_active) {
    throw new Error('User account is inactive');
  }

  // 3. Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid username or password');
  }

  // 4. Get user profile details based on role
  let profileDetails = {};
  if (user.role === 'student') {
    const [studentDetails] = await pool.query(
      'SELECT name, roll_no, department, academic_year, cpi FROM student_profiles WHERE user_id = ?',
      [user.user_id]
    );
    profileDetails = studentDetails[0] || {};
  } else if (user.role === 'professor') {
    const [professorDetails] = await pool.query(
      'SELECT name, department FROM professor_profiles WHERE user_id = ?',
      [user.user_id]
    );
    profileDetails = professorDetails[0] || {};
  }

  // 5. Generate JWT token
  const token = jwt.sign(
    { user_id: user.user_id, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  // 6. Return user data with token (excluding password_hash)
  return {
    token,
    user: {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
      ...profileDetails
    }
  };
};

module.exports = { getUserProfile, loginUser };