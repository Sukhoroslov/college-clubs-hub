const User = require('../models/User');

exports.registerGet = (req, res) => {
  res.render('register');
};

exports.registerPost = async (req, res, next) => {
  const { username, email, password } = req.body;


  if (!username || !email || !password) {
    req.flash('error', 'All fields are required');
    return res.redirect('/register');
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    req.flash('error', 'Invalid email format');
    return res.redirect('/register');
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!passwordRegex.test(password)) {
    req.flash('error', 'Password must be at least 8 characters, with an uppercase letter, number, and special character');
    return res.redirect('/register');
  }

  try {
    const user = new User({ username, email, password });
    await user.save();
    req.login(user, (err) => {
      if (err) return next(err);
      req.flash('success', 'Registration successful! Welcome.');
      res.redirect('/dashboard');
    });
  } catch (err) {
    if (err.code === 11000) {
      req.flash('error', 'Username or email already taken');
    } else {
      req.flash('error', 'Registration failed. Please try again.');
    }
    res.redirect('/register');
  }
};

exports.loginGet = (req, res) => {
  res.render('login');
};

exports.loginPost = (req, res) => {
  req.flash('success', 'Welcome back!');
  res.redirect('/dashboard');
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', 'Logged out successfully');
    res.redirect('/');
  });
};