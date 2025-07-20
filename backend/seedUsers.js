const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const DBSOURCE = path.join(__dirname, 'database.sqlite');

let db = new sqlite3.Database(DBSOURCE, async (err) => {
  if (err) {
    console.error('Could not connect to database', err);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database');

    try {
      // Delete all old users before inserting new ones
      db.run(`DELETE FROM users`, function(err) {
        if (err) {
          console.error('Error deleting old users:', err);
        } else {
          console.log('All old users deleted');
        }
      });

      const insertUser = `INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)`;
      const hashedPassword = await bcrypt.hash('employee', 10);

      db.run(insertUser, ['employee@arise.com', hashedPassword, 'employee'], function(err) {
        if (err) {
          console.error('Error inserting employee user:', err);
        } else {
          console.log('Employee user created or already exists');
        }
      });

      db.run(insertUser, ['client@arise.com', hashedPassword, 'client'], function(err) {
        if (err) {
          console.error('Error inserting client user:', err);
        } else {
          console.log('Client user created or already exists');
        }
      });
    } catch (error) {
      console.error('Error hashing password or inserting users:', error);
    }
  }
});
