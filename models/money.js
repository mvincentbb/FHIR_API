const mongoose = require('mongoose')
const  Schema  = mongoose.Schema

const moneySchema = Schema({
    _id: false,
    value: { type: Number }, // Numerical value (with implicit precision)
    currency: { type: String, match: /^[^\s]+(\s[^\s]+)*$/g } // Coded form of the unit
})

module.exports = mongoose.model('MoneySchema', moneySchema)
module.exports = moneySchema