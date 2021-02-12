const mongoose = require('mongoose')
const addressSchema = require('./address')
const codeableConceptSchema = require('./codeableConcept')
const contactPointSchema = require('./contactPoint')
const identifierSchema = require('./identifier')
const metaSchema = require('./meta')
const referenceSchema = require('./reference')
const humanNameSchema = require('./humanName')
const textSchema = require('./text')
const  Schema  = mongoose.Schema

const organisationSchema = Schema({

        resourceType: {
            type: String,
            required: true,
            validate:{
                validator: function (value) {
                    return value === 'Organization'   
                }
            }
        },
        meta = { type: metaSchema },
        text = { type: textSchema },
        // from Resource: id, meta, implicitRules, and language
        // from DomainResource: text, contained, extension, and modifierExtension
        identifier: [{ type: identifierSchema }], // C? Identifies this organization  across multiple systems
        active: { type: Boolean }, // Whether the organization's record is still in active use
        type: [{ type: codeableConceptSchema }], // Kind of organization
        name: { type: String }, // C? Name used for the organization
        _name: { type: String }, // C? Name used for the organization
        alias: [{ type: String }], // A list of alternate names that the organization is known as, or was known as in the past
        _alias: [{ type: String }], // A list of alternate names that the organization is known as, or was known as in the past
        telecom: [{ type: contactPointSchema }], // C? A contact detail for the organization
        address: [{ type: addressSchema }], // C? An address for the organization
        partOf: { 
            type: referenceSchema,
            validate: {
                validator: function (value) {
                    const typeOfReferenceRegex = /^(Organisation\/)(\S)+$/g
                    return typeOfReferenceRegex.test(value.reference) 
                
                }
            }
         }, // The organization of which this organization forms a part
        contact: [{ // Contact for the organization for a certain purpose
          purpose: { type: codeableConceptSchema }, // The type of contact
          name: { type: humanNameSchema }, // A name associated with the contact
          telecom: [{ type: contactPointSchema }], // Contact details (telephone, email, etc.)  for a contact
          address: { type: addressSchema } // Visiting or postal addresses for the contact
        }],
        endpoint: [{ 
            type: referenceSchema,
            validate: {
                validator: {
                    function (value) {
                        const typeOfReferenceRegex = /^(Endpoint\/)(\S)+$/g
                    }
                }
            }
         }] // Technical endpoints providing access to services operated for the organization

},
{ collection: 'Organisation' }
)

module.exports = mongoose.model('Organisation', organisationSchema )
module.exports = organisationSchema