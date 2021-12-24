const mongoose = require('mongoose')
const Schema = mongoose.Schema

const textSchema = Schema({
  _id: false,
  status: {
    type: String,
    enum: ['generated', 'extensions', 'additional', 'empty']
  },
  div: { type: String }
})

module.exports = mongoose.model('Text', textSchema)
module.exports = textSchema
