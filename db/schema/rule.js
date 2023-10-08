const mongoose = require('mongoose')

const RuleSchema = mongoose.Schema({
    ruleName: String,
    rulePage: Array,
    notes: String
})

module.exports = RuleSchema;