const mongoose = require('mongoose')
const codeableConceptSchema = require('./codeableConcept')
const identifierSchema = require('./identifier')
const metaSchema = require('./meta')
const periodSchema = require('./period')
const referenceSchema = require('./reference')
const moneySchema = require('./money')
const Schema = mongoose.Schema

const coverageSchema = Schema({
        resourceType: { type: String },
        _id:  { type: String },
        id:  { type: String },
        meta: { type: metaSchema },
        // from Resource: id, meta, implicitRules, and language
        // from DomainResource: text, contained, extension, and modifierExtension
        identifier: [{ type: identifierSchema  }], // Business Identifier for the coverage
        status: { type: String, enum: ['active', 'cancelled', 'draft', 'entered-in-error']}, // R!  active | cancelled | draft | entered-in-error
        type: { type: codeableConceptSchema }, // Coverage category such as medical or accident
        policyHolder: { type: referenceSchema }, // Owner of the policy
        subscriber: { type: referenceSchema }, // Subscriber to the policy
        subscriberId: { type: String}, // ID assigned to the subscriber
        beneficiary: { type: referenceSchema }, // R!  Plan beneficiary
        dependent: { type: String}, // Dependent number
        relationship: { type: codeableConceptSchema }, // Beneficiary relationship to the subscriber
        period: { type: periodSchema }, // Coverage start and end dates
        payor: [{ type: referenceSchema }], // R!  Issuer of the policy
        class: [{ // Additional coverage classifications
          type: { type: codeableConceptSchema }, // R!  Type of class such as 'group' or 'plan'
          value: { type: String }, // R!  Value associated with the type
          name: { type: String }, // Human readable description of the type and value
        }],
        order: { type: String, match: /^[1-9][0-9]*$/g }, // Relative order of the coverage
        network: { type: String }, // Insurer network
        costToBeneficiary: [{ // Patient payments for services/products
          type: { type: codeableConceptSchema }, // Cost category
          // value[x]: The amount or percentage due from the beneficiary. One of these 2:
          valueQuantity: { type: quantitySchema },
          valueMoney: { type: moneySchema },
          exception: [{ // Exceptions for patient payments
            type: { type: codeableConceptSchema }, // R!  Exception category
            period: { type: periodSchema } // The effective period of the exception
          }]
        }],
        subrogation: { type: Boolean }, // Reimbursement to insurer
        contract: [{ type: referenceSchema }] // Contract details
})