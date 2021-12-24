const mongoose = require('mongoose')
const codingSchema = require('./coding.models')
const Schema = mongoose.Schema

const codeableConceptSchema = Schema({
  // from Element: extension
  _id: false,
  coding: [{ type: codingSchema }], // Code defined by a terminology system
  text: { type: String } // Plain text representation of the concept
})
module.exports = mongoose.model('CodeableConcept', codeableConceptSchema)
module.exports = codeableConceptSchema
