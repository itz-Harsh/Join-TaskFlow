const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {   firstname: {
            type: String,
            required: true,
            uniqure: false,
        },
        lastname: {
            type: String,
            required: true,
            uniqure: false,
        },
 
        username: {
            type: String,
            required: true,
            uniqure: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
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