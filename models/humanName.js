const mongoose = require('mongoose')
const  Schema  = mongoose.Schema
const periodSchema = require('./period')

const humanNameSchema = new Schema({

  _id: false,
  use: { type: String, enum: ['usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden']}, // usual | official | temp | nickname | anonymous | old | maiden
  text: { type: String }, // Text representation of the full name
  family: { type: String }, // Family name (often called 'Surname')
  given: [{ type: String }], // Given names (not always 'first'). Includes middle names
  prefix: [{ type: String }], // Parts that come before the name
  suffix: [{ type: String }], // Parts that come after the name
  period:  { type: periodSchema } // Time period when name was/is in use
})

module.exports = mongoose.model('HumanName', humanNameSchema )
module.exports = humanNameSchema
