import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import flash from "connect-flash";
import User from "./models/User";

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
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      // @ts-expect-error
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
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["displayName"],
    },
    (accessToken, refreshToken, profile, cb) => {
      // @ts-expect-error
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

let photosArray = [];
let favoritedPhotosArray = [];

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/auth"));
app.use("/photo", require("./routes/photo"));
app.use("/photos", require("./routes/photos"));
app.use("/profile", require("./routes/profile"));
app.use("/error", require("./routes/error"));

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
