const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {   source: {
            type: String,
            required: true,
            unique: false,
        },
        githubId: {
            type: String,
            required: false,
            unique: true,
        },
        firstname: {
            type: String,
            required: true,
            unique: false,
        },
        lastname: {
            type: String,
            required: true,
            unique: false,
        },
 
        username: {
            type: String,
            required: true,
            unique: true,
        },

        email: {
            type: String,
            required: true,
            unique: false,
        },

        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", UserSchema);

module.exports = User;