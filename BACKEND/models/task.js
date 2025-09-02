const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        completed: {
            type: Boolean,
            default: false,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
