const mongoose = require('mongoose')
const Schema = mongoose.Schema
const codeableConceptSchema = require('./codeableConcept')
const periodSchema = require('./period')
const referenceSchema = require('./reference')


const identifierSchema = Schema({
        // from Element: extension
        use : {type : String, enum : ['usual', 'official', 'temp', 'secondary', 'old']},//<code, // usual | official | temp | secondary | old (If known)
        type : { codeableConceptSchema }, // Description of identifier
        system : { type : String }, // The namespace for the identifier value
        value : { type: String }, // The value that is unique
        period : { periodSchema }, // Time period when id is/was valid for use
        assigner : { referenceSchema } // Organization that issued id (may be just text)
})

module.exports = mongoose.model('Identifier', identifierSchema )
module.exports = identifierSchema

