const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


app.use(session({
  secret: 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }
}));


app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.user = req.user;
  next();
});


app.use(passport.initialize());
app.use(passport.session());


const authRoutes = require('./routes/auth');
app.use(authRoutes);