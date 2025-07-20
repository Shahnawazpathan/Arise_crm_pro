const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBSOURCE = path.join(__dirname, 'database.sqlite');

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS demands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        quantity INTEGER,
        demand_date TEXT
      )`, (err) => {
        if (err) {
          console.error('Table creation error', err);
        } else {
          // Insert sample data
          const insert = 'INSERT INTO demands (name, quantity, demand_date) VALUES (?, ?, ?)';
          db.run(insert, ['Product A', 10, '2024-06-01']);
          db.run(insert, ['Product B', 5, '2024-06-02']);
          db.run(insert, ['Product C', 20, '2024-06-03']);
        }
      });

      db.run(`CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        firstName TEXT,
        lastName TEXT,
        passportNumber TEXT,
        nationality TEXT,
        dateOfBirth TEXT,
        contactNumber TEXT,
        email TEXT
      )`, (err) => {
        if (err) {
          console.error('Clients table creation error', err);
        } else {
          // Insert sample client data
          const insertClient = `INSERT OR IGNORE INTO clients (id, firstName, lastName, passportNumber, nationality, dateOfBirth, contactNumber, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
          db.run(insertClient, ['c7a4c5a3-4a7c-4c4c-8a0a-4a2c7c7d7e3a', 'Farhan', 'Ahmed', 'K8765432', 'Pakistani', '1990-05-15', '+923001234567', 'client@example.com']);
        }
      });

      db.run(`CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT,
        type TEXT,
        timestamp TEXT,
        read INTEGER
      )`, (err) => {
        if (err) {
          console.error('Notifications table creation error', err);
        } else {
          // Insert sample notifications
          const insertNotification = `INSERT OR IGNORE INTO notifications (id, message, type, timestamp, read) VALUES (?, ?, ?, ?, ?)`;
          db.run(insertNotification, [1, 'Client Farhan Ahmed status changed to "Appointment Booked".', 'status', new Date(Date.now() - 3600000).toISOString(), 0]);
          db.run(insertNotification, [2, 'New client "Aisha Khan" has been added.', 'client', new Date(Date.now() - 2 * 3600000).toISOString(), 0]);
          db.run(insertNotification, [3, 'System maintenance scheduled for tomorrow at 2 AM.', 'system', new Date(Date.now() - 5 * 3600000).toISOString(), 1]);
          db.run(insertNotification, [4, 'Client John Doe status changed to "Fit".', 'status', new Date(Date.now() - 24 * 3600000).toISOString(), 1]);
          db.run(insertNotification, [5, 'Your report for "June 2024" is ready for download.', 'system', new Date(Date.now() - 2 * 24 * 3600000).toISOString(), 0]);
          db.run(insertNotification, [6, 'Client "Maria Garcia" has been successfully onboarded.', 'client', new Date(Date.now() - 3 * 24 * 3600000).toISOString(), 1]);
        }
      });

      db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        clientId TEXT,
        appointmentDate TEXT,
        medicalCenterName TEXT,
        paymentStatus TEXT,
        bookingStatus TEXT,
        medicalResultStatus TEXT,
        bookingDate TEXT,
        FOREIGN KEY(clientId) REFERENCES clients(id)
      )`, (err) => {
        if (err) {
          console.error('Appointments table creation error', err);
        } else {
          // Insert sample appointments
          const insertAppointment = `INSERT OR IGNORE INTO appointments (id, clientId, appointmentDate, medicalCenterName, paymentStatus, bookingStatus, medicalResultStatus, bookingDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
          db.run(insertAppointment, ['appt-1', 'c7a4c5a3-4a7c-4c4c-8a0a-4a2c7c7d7e3a', '2024-07-01', 'Health Center A', 'Paid', 'Booked', 'Fit', '2024-06-15']);
        }
      });

      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
      )`, (err) => {
        if (err) {
          console.error('Users table creation error', err);
        }
      });
    });
  }
});

module.exports = db;
