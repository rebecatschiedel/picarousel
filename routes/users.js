const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// User Model
const User = require('../models/User');

// Login page
router.get('/login', (req, res) => {
    res.render('login', {title: "Login",});
});

// Register page
router.get('/register', (req, res) => {
    res.render('register', {title: "Register"});
});

// Register Handle
router.post('/register', catchAsync(async(req, res, next) => {    
    try {
        const { name, email, password, confirmPassword } = req.body;
        
        if( password !== confirmPassword ) {
            req.flash('error', "Passwords do not match");
            return res.redirect('/users/register');
        }

        const user = new User({email, name});
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', "Welcome to Picarousel!!");

            res.redirect('/profile');
        })
    } catch(e) {
        req.flash('error', e.message);
        console.log(e);
        res.redirect('/users/register');
    }
}));

// Login handle
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/users/login'}), (req, res) => {
    req.flash('success', "Welcome to Picarousel");

    const redirectUrl = req.session.returnTo || "/profile";
    delete req.session.returnTo;

    res.redirect(redirectUrl);
});

// Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;