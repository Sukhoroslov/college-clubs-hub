const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();

const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI not set. Copy .env.example to .env and set MONGO_URI.');
  process.exit(1);
}

connectDB(MONGO_URI).catch((err) => {
  console.error('Failed to connect to DB, exiting.');
  process.exit(1);
});

const app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false
}));

// routes
app.use('/', require('./routes/index'));
app.use('/api/clubs', require('./routes/api/clubs'));
app.use('/api/events', require('./routes/api/events'));

// 404 handler
app.use((req, res, next) => {
  res.status(404);
  // respond with html page
  if (req.accepts('html')) return res.render('404', { url: req.url });
  // respond with json
  if (req.accepts('json')) return res.json({ error: 'Not found' });
  // default
  res.type('txt').send('Not found');
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  if (req.accepts('json')) {
    return res.json({ error: err.message || 'Internal Server Error' });
  }
  res.render('error', { error: err });
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// graceful shutdown
process.on('SIGINT', () => {
  console.info('SIGINT received, shutting down.');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});