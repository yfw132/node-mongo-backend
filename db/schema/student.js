const mongoose = require('mongoose')

const StudentSchema = mongoose.Schema({
    name: String,
    birthday: Date,
    gender: String,
    source: String,
    family: Array,
    nickname: String,
    status: String,
    intentionLevel: String,
    consultant: String,
    market: String,
    partTimeName: String,
    partTimePhone: String,
    address: String,
    remarks: String,
    creatTime: Date
})

module.exports = StudentSchema;