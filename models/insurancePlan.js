const mongoose = require('mongoose')
const codeableConceptSchema = require('./codeableConcept')
const identifierSchema = require('./identifier')
const periodSchema = require('./period')
const referenceSchema = require('./reference')
const humanNameSchema = require('./humanName')
const contactPointSchema = require('./contactPoint')
const addressSchema = require('./address')
const quantitySchema = require('./quantity')
const moneySchema = require('./money')
const metaSchema = require('./meta')
const textSchema = require('./text')
const  Schema  = mongoose.Schema

const insurancePlanSchema = Schema(
    {   
        
        resourceType: { 
            type:String , 
            validate: {
                validator: function (value) {
                    value === 'InsurancePlan'
                }
            },
            required: true
        },
        meta: { type: metaSchema },
        text: { type: textSchema },
        // from Resource: id, meta, implicitRules, and language
        // from DomainResource: text, contained, extension, and modifierExtension
        identifier: [{ type: identifierSchema }], // C? Business Identifier for Product
        status: { type: String, enum: ['draft', 'active', 'retired', 'unknown']}, // draft | active | retired | unknown
        _status: { type: String, enum: ['draft', 'active', 'retired', 'unknown']}, // draft | active | retired | unknown
        type: [{ type: codeableConceptSchema }], // Kind of product
        name: { type: String }, // C? Official name
        _name: { type: String }, // C? Official name
        alias: [{ type: String }], // Alternate names
        _alias: [{ type: String }], // Alternate names
        period: { type: periodSchema }, // When the product is available
        ownedBy: { type: referenceSchema }, // Plan issuer
        administeredBy: { type: referenceSchema }, // Product administrator
        coverageArea: [{ type: referenceSchema }], // Where product applies
        contact: [{ // Contact for the product
            purpose: { type: codeableConceptSchema }, // The type of contact
            name: { type: humanNameSchema  }, // A name associated with the contact
            telecom: [{ type: contactPointSchema }], // Contact details (telephone, email, etc.)  for a contact
            address: { type: addressSchema } // Visiting or postal addresses for the contact
        }],
        endpoint: [{ type: referenceSchema }], // Technical endpoint
        network: [{ type: referenceSchema }], // What networks are Included
        coverage: [{ // Coverage details
            type: { type: codeableConceptSchema }, // R!  Type of coverage
            network: [{ type: referenceSchema }], // What networks provide coverage
            benefit: [{ // R!  List of benefits
            type: { type: codeableConceptSchema }, // R!  Type of benefit
            requirement: { type: String }, // Referral requirements
            limit: [{ // Benefit limits
                value: { type: quantitySchema }, // Maximum value allowed
                code: { type: codeableConceptSchema } // Benefit limit details
            }]
            }]
        }],
        plan: [{ // Plan details
            identifier: [{ type: identifierSchema }], // Business Identifier for Product
            type: { type: codeableConceptSchema }, // Type of plan
            coverageArea: [{ type: referenceSchema }], // Where product applies
            network: [{ type: referenceSchema }], // What networks provide coverage
            generalCost: [{ // Overall costs
            type: { type: codeableConceptSchema }, // Type of cost
            groupSize: {type: String, match: /^[1-9][0-9]*$/g }, // Number of enrollees
            cost: { type: moneySchema }, // Cost value
            comment: {type: String } // Additional cost information
            }],
            specificCost: [{ // Specific costs
            category: { type: codeableConceptSchema }, // R!  General category of benefit
            benefit: [{ // Benefits list
                type: { type: codeableConceptSchema }, // R!  Type of specific benefit
                cost: [{ // List of the costs
                type: { type: codeableConceptSchema }, // R!  Type of cost
                applicability: { type: codeableConceptSchema }, // in-network | out-of-network | other
                qualifiers: [{ type: codeableConceptSchema }], // Additional information about the cost
                value: { type: quantitySchema } // The actual cost value
                }]
            }]
            }]
        }]
        },
        { collection: 'InsurancePlan' }

)
module.exports = mongoose.model('InsurancePlan', insurancePlanSchema )
module.exports = insurancePlanSchema