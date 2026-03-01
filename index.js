require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const donorRoutes = require('./routes/donor.routes');
const bloodBankRoutes = require('./routes/blood-bank.routes');

const app = express();
const PORT = process.env.PORT || 8080;
const allowedOrigins = process.env.ALLOWED_ORIGIN
    ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:5173'];

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'POST,GET,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/blood-banks', bloodBankRoutes);

// Health check endpoint
app.get("/", (req, res) => {
    res.send("RTBMS Backend (MVC) is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something broke!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
