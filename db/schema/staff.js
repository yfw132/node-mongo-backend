const mongoose = require('mongoose')

const StaffSchema = mongoose.Schema({
    name: String,
    phone: String,
    entryTime: String,
    station: String,
    status: { type: Number, default: 0 }
})

module.exports = StaffSchema;
