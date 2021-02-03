const mongoose = require('mongoose')
const identifierSchema = require('./identifier')
const Schema = mongoose.Schema

const referenceSchema = new Schema({
    reference : {type : String}, // C? Literal reference, Relative, internal or absolute URL
    type : {type : String}, // URI Type the reference refers to (e.g. Patient)
    identifier : { identifierSchema }, // Logical reference, when literal reference is not known
    display : {type: String} // Text alternative for the resource
})

module.exports = mongoose.model('Reference', referenceSchema )
module.exports = referenceSchema