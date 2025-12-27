const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');


router.get('/register', authController.registerGet);
router.post('/register', authController.registerPost);


router.get('/login', authController.loginGet);
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), authController.loginPost);


router.post('/logout', authController.logout);

module.exports = router;