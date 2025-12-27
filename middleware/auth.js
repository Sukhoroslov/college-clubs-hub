

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You must be logged in');
  res.redirect('/login');
}

function isPresident(req, res, next) {
  if (req.user && req.user.role === 'president') {
    return next();
  }
  req.flash('error', 'You must be a club president to access this');
  res.redirect('/dashboard');
}

module.exports = { isAuthenticated, isPresident };