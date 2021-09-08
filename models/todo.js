const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    record: [{
        task: {
            type: String
        },
        date: {
            type: String,
            required: true,
            default: Date.now
        }
    }]
})

const model = mongoose.model('todoModel', todoSchema)

module.exports = model