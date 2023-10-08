const mongoose = require('mongoose')

const VerifySchema = mongoose.Schema({
    code: String,
    phone: String,
    time: Date,
})

module.exports = VerifySchema;