import express from "express";
import passport from "passport";


const usersRouter = express.Router();

// User Model
import User from "../models/User";

// Login page
usersRouter.get('/login', (req, res) => {
    res.render('login', {title: "Login",});
});

// Register page
usersRouter.get('/register', (req, res) => {
    res.render('register', {title: "Register"});
});

// Register Handle
usersRouter.post('/register', async(req, res, next) => {    
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
        res.redirect('/users/register');
    }
});

// Login handle
usersRouter.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/users/login'}), (req, res) => {
    req.flash('success', "Welcome to Picarousel");

    const redirectUrl = req.session.returnTo || "/profile";
    delete req.session.returnTo;

    res.redirect(redirectUrl);
});

// Logout handle
usersRouter.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

export default usersRouter;