const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'delicious_user', // Change if using 'root'
    password: 'password123', // <--- MAKE SURE THIS IS YOUR PASSWORD
    database: 'something_delicious_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database!');
});

// Routes
app.get('/api/availability', (req, res) => {
    const sql = 'SELECT * FROM table_inventory';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const inventory = {};
        results.forEach(row => {
            inventory[row.type_id] = { price: row.price, total: row.total_qty };
        });
        res.json(inventory);
    });
});

app.post('/api/book', (req, res) => {
    const { name, email, phone, date, tableType, paymentMethod, amount } = req.body;
    
    // Check inventory
    db.query('SELECT total_qty FROM table_inventory WHERE type_id = ?', [tableType], (err, resInv) => {
        if (err || resInv.length === 0) return res.status(500).json({ message: 'Error checking table' });
        
        // Check current bookings
        db.query('SELECT COUNT(*) as count FROM bookings WHERE table_type = ? AND booking_date = ?', [tableType, date], (err, resBook) => {
            if (resBook[0].count >= resInv[0].total_qty) {
                return res.status(400).json({ message: 'Fully booked!' });
            }
            
            // Insert Booking
            const sql = `INSERT INTO bookings (customer_name, phone, email, booking_date, table_type, payment_method, amount_paid) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const values = [name, phone, email, date, tableType, paymentMethod, parseFloat(amount.replace('₹', ''))];
            
            db.query(sql, values, (err, result) => {
                if (err) return res.status(500).json({ message: 'Save failed' });
                res.json({ success: true, message: 'Booking Saved!', bookingId: result.insertId });
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});