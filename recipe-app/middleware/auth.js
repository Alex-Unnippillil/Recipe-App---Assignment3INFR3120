// middleware/auth.js

function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Not logged in - redirect to login
  res.redirect('/auth/login');
}

module.exports = { ensureAuth };
