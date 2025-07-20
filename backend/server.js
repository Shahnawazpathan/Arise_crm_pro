const express = require('express');
const db = require('./db');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your_jwt_secret'; // In a real app, use an environment variable

app.use(cors());
app.use(express.json());

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    db.run(sql, [email, hashedPassword, role], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Email already exists' });
      }
      res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email, role: user.role } });
  });
});

// Endpoint to get all demands
app.get('/api/demands', (req, res) => {
  const sql = 'SELECT * FROM demands';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Endpoint to get all clients
app.get('/api/clients', (req, res) => {
  const sql = 'SELECT * FROM clients';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Endpoint to get all notifications
app.get('/api/notifications', (req, res) => {
  const sql = 'SELECT * FROM notifications ORDER BY timestamp DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Endpoint to add a notification
app.post('/api/notifications', (req, res) => {
  const { message, type } = req.body;
  if (!message || !type) {
    res.status(400).json({ error: 'Missing message or type' });
    return;
  }
  const timestamp = new Date().toISOString();
  const read = 0;
  const sql = 'INSERT INTO notifications (message, type, timestamp, read) VALUES (?, ?, ?, ?)';
  db.run(sql, [message, type, timestamp, read], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Notification added',
      id: this.lastID
    });
  });
});

// Endpoint to get dashboard stats
app.get('/api/dashboard-stats', (req, res) => {
  const stats = {};
  db.serialize(() => {
    db.get('SELECT COUNT(*) AS totalClients FROM clients', [], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      stats.totalClients = row.totalClients;

      db.get("SELECT COUNT(*) AS statusFit FROM appointments WHERE medicalResultStatus = 'Fit'", [], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        stats.statusFit = row.statusFit;

        db.get("SELECT COUNT(*) AS statusUnfit FROM appointments WHERE medicalResultStatus = 'Unfit'", [], (err, row) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          stats.statusUnfit = row.statusUnfit;

          db.get("SELECT COUNT(*) AS pendingAppointments FROM appointments WHERE bookingStatus = 'Booked'", [], (err, row) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            stats.pendingAppointments = row.pendingAppointments;

            res.json({
              message: 'success',
              data: stats
            });
          });
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Endpoint to get all appointments
app.get('/api/appointments', (req, res) => {
  const sql = 'SELECT * FROM appointments';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Endpoint to get appointment by id
app.get('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM appointments WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Endpoint to create a new appointment
app.post('/api/appointments', (req, res) => {
  const { id, clientId, appointmentDate, medicalCenterName, paymentStatus, bookingStatus, medicalResultStatus, bookingDate } = req.body;
  if (!id || !clientId || !appointmentDate) {
    res.status(400).json({ error: 'Missing required fields: id, clientId, appointmentDate' });
    return;
  }
  const sql = `INSERT INTO appointments (id, clientId, appointmentDate, medicalCenterName, paymentStatus, bookingStatus, medicalResultStatus, bookingDate)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [id, clientId, appointmentDate, medicalCenterName, paymentStatus, bookingStatus, medicalResultStatus, bookingDate], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({
      message: 'Appointment created',
      id: id
    });
  });
});

// Endpoint to update an appointment by id
app.put('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { clientId, appointmentDate, medicalCenterName, paymentStatus, bookingStatus, medicalResultStatus, bookingDate } = req.body;
  const sql = `UPDATE appointments SET clientId = ?, appointmentDate = ?, medicalCenterName = ?, paymentStatus = ?, bookingStatus = ?, medicalResultStatus = ?, bookingDate = ? WHERE id = ?`;
  db.run(sql, [clientId, appointmentDate, medicalCenterName, paymentStatus, bookingStatus, medicalResultStatus, bookingDate, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json({
      message: 'Appointment updated',
      id: id
    });
  });
});

// Endpoint to delete an appointment by id
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM appointments WHERE id = ?';
  db.run(sql, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json({
      message: 'Appointment deleted',
      id: id
    });
  });
});

// Endpoint to get report data
app.get('/api/reports', (req, res) => {
  const reportData = {};
  db.serialize(() => {
    // Nationality counts
    db.all('SELECT nationality, COUNT(*) AS count FROM clients GROUP BY nationality', [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      reportData.nationalityCounts = rows;

      // Appointment status counts
      db.all('SELECT medicalResultStatus AS status, COUNT(*) AS count FROM appointments GROUP BY medicalResultStatus', [], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        reportData.statusCounts = rows;

        res.json({
          message: 'success',
          data: reportData
        });
      });
    });
  });
});
