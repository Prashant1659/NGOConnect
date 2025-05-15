// app.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const ngoRoutes = require('./routes/ngo.routes');
const donorRoutes = require('./routes/donor.routes');
const adminRoutes = require('./routes/admin.routes');
const flash = require('connect-flash');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ngoWebsite', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Error:', err));

// Session middleware
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/ngoWebsite' })
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(flash());
// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const campaignRoutes = require('./routes/campaigns');
app.use('/', campaignRoutes);

// Routes
app.use('/', authRoutes);
app.use('/ngo', ngoRoutes);
app.use('/donor', donorRoutes);
app.use('/admin', adminRoutes);


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
