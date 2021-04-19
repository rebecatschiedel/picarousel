import express from "express";
import "dotenv/config";
import mongoose, { Document } from "mongoose";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import flash from "connect-flash";
import User from "./models/User";

import indexRouter from "./routes/index";
import authRouter from "./routes/auth";
import errorRouter from "./routes/error";
import photoRouter from "./routes/photo";
import photosRouter from "./routes/photos";
import profileRouter from "./routes/profile";
import usersRouter from "./routes/users";


const PORT = process.env.PORT || 3000;

const app = express();

app.use("/static", express.static("static"));
app.use(flash());

// PUG
app.set("views", __dirname + "/views");
app.set("view engine", "pug");

// Bodyparser deprecated solution
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express session
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

if (!process.env.MONGODB_URL) throw new Error("MONGODB_URL must be set");

// MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//Mongoose
const db = mongoose.connection;
db.on("error", () => console.error(" MongoDB connection error:"));
db.once("open", () => console.log("Database connected"));

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser((user, done) => {
  // @ts-expect-error undefined value
  return done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (!err) {
      return done(null, user);
    } else {
      return done(err, null);
    }
  });
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

passport.use(
  new GoogleStrategy(
    {
      // @ts-expect-error undefined value
      clientID: process.env.GOOGLE_CLIENT_ID,
      // @ts-expect-error undefined value
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      // @ts-expect-error untyped library
      User.findOrCreate(
        { googleId: profile.id },
        { name: profile.displayName },
        (err, user) => {
          return cb(err, user);
        }
      );
    }
  )
);
passport.use(
  // @ts-expect-error undefined value 
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["displayName"],
    },
    (accessToken, refreshToken, profile, cb) => {
      // @ts-expect-error untyped library
      User.findOrCreate(
        { facebookId: profile.id },
        { name: profile.displayName },
        (err, user) => {
          return cb(err, user);
        }
      );
    }
  )
);

export const photosArray = [];
export const favoritedPhotosArray = [];

// Routes

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/photo", photoRouter);
app.use("/photos", photosRouter);
app.use("/profile", profileRouter);
app.use("/error", errorRouter);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
