const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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
