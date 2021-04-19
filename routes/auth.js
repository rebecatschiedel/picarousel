import express from "express";
import passport from "passport";

const authRouter = express.Router();

// Google Auth Page
authRouter.get('/google', passport.authenticate('google', { scope: ['profile'] }));

authRouter.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  (req, res) => {
    res.redirect('/profile');
  });

authRouter.get('/facebook', passport.authenticate('facebook'));

authRouter.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/users/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/profile');
});

export default authRouter;