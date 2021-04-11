const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    googleId: {
        type: String
    },
    facebookId: {
        type: String
    },
    favoritePhotos: {
        type: Array
    }
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
UserSchema.plugin(findOrCreate);

const User = mongoose.model('User', UserSchema)

module.exports = User;
