const db = require('./db');
const bcrypt = require('bcrypt');

const adminEmail = 'admin@example.com';
const adminPassword = 'admin123'; // You can change this to a more secure password
const adminRole = 'admin';

async function seedAdmin() {
  try {
    // Check if admin user already exists
    db.get('SELECT * FROM users WHERE email = ?', [adminEmail], async (err, row) => {
      if (err) {
        console.error('Error querying the database:', err);
        process.exit(1);
      }
      if (row) {
        console.log('Admin user already exists.');
        process.exit(0);
      } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        // Insert the admin user
        const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
        db.run(sql, [adminEmail, hashedPassword, adminRole], function (err) {
          if (err) {
            console.error('Error inserting admin user:', err);
            process.exit(1);
          }
          console.log('Admin user created successfully with id:', this.lastID);
          process.exit(0);
        });
      }
    });
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
