import mongoose, {
  PassportLocalDocument,
  PassportLocalModel,
  PassportLocalSchema,
} from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import findOrCreate from "mongoose-findorcreate";

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
    default: Date.now,
  },
  googleId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  favoritePhotos: {
    type: Array,
  },
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });
UserSchema.plugin(findOrCreate);

const User: PassportLocalModel<PassportLocalDocument> = mongoose.model(
  "User",
  UserSchema as PassportLocalSchema
);

export default User;
