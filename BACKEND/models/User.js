const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
    },

    // optional GitHub id for oauth users; `sparse: true` allows multiple docs missing this field
    id: {
      type: String,
      required: true,
      unique: true,
    },

    photoUrl:{
        type: String,
    },

    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    
    lastname: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },









  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;