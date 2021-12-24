const mongoose = require('mongoose')
const Schema = mongoose.Schema

const codingSchema = Schema({
  _id: false,
  // from Element: extension
  system: { type: String }, // <uri>, // Identity of the terminology system
  version: { type: String }, // <string>, // Version of the system - if relevant
  code: { type: String }, // <code>, // Symbol in syntax defined by the system
  display: { type: String }, // Representation defined by the system
  userSelected: { type: Boolean } //   If this coding was chosen directly by the user
})

module.exports = mongoose.model('Coding', codingSchema)
module.exports = codingSchema
