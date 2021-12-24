const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quantitySchema = Schema({
  _id: false,
  // from Element: extension
  value: { type: Number }, // Numerical value (with implicit precision)
  comparator: { type: String, enum: ['< ', '<= ', '>=', '>'] }, // < | <= | >= | > - how to understand the value
  unit: { type: String }, // Unit representation
  system: { type: String }, // C? System that defines coded unit form
  code: { type: String, match: /^[^\s]+(\s[^\s]+)*$/g } // Coded form of the unit
})

module.exports = mongoose.model('QuantitySchema', quantitySchema)
module.exports = quantitySchema
