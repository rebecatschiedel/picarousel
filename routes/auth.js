const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google Auth Page
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  (req, res) => {
    res.redirect('/profile');
  });

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/users/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/profile');
});

module.exports = router;