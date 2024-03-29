const mongoose = require('mongoose')
const Schema = mongoose.Schema
const identifierSchema = require('../dataTypes/identifier.model')
const humanNameSchema = require('../dataTypes/humanName.model')
const contactPointSchema = require('../dataTypes/contactPoint.model')
const codeableConceptSchema = require('../dataTypes/codeableConcept.model')
const attachementSchema = require('../dataTypes/attachement.model')
const addressSchema = require('../dataTypes/address.model')
const referenceSchema = require('../dataTypes/reference.model')
const periodSchema = require('../dataTypes/period.model')
const metaSchema = require('../dataTypes/meta.model')
const textSchema = require('../dataTypes/text.model')

const patientSchema = new Schema(
  {
    resourceType: { type: String },
    _id: String,
    id: String,
    meta: { type: metaSchema },
    text: { type: textSchema },
    // from Resource: id, meta, implicitRules, and language
    // from DomainResource: text, contained, extension, and modifierExtension
    identifier: [{ type: identifierSchema }], // An identifier for this patient
    active: Boolean, // Whether this patient's record is in active use
    name: [{ type: humanNameSchema }], // A name associated with the patient
    telecom: [{ type: contactPointSchema }], // A contact detail for the individual
    gender: { type: String, enum: ['male', 'female', 'other', 'unknown'] }, // male | female | other | unknown
    birthDate: { type: Date }, // The date of birth for the individual
    // deceased[x]: Indicates if the individual is deceased or not. One of these 2:
    deceasedBoolean: Boolean,
    deceasedDateTime: { type: Date },
    address: [{ type: addressSchema }], // An address for the individual
    maritalStatus: { type: codeableConceptSchema }, // Marital (civil) status of a patient
    // multipleBirth[x]: Whether patient is part of a multiple birth. One of these 2:
    multipleBirthBoolean: { type: Boolean },
    multipleBirthInteger: { type: Number },
    photo: [{ type: attachementSchema }], // Image of the patient
    contact: [
      {
        // A contact party (e.g. guardian, partner, friend) for the patient
        relationship: [{ type: codeableConceptSchema }], // The kind of relationship
        name: { type: humanNameSchema }, // A name associated with the contact person
        telecom: [{ type: contactPointSchema }], // A contact detail for the person
        address: { type: addressSchema }, // Address for the contact person
        gender: { type: String, enum: ['male', 'female', 'other', 'unknown'] }, // male | female | other | unknown
        organization: { type: referenceSchema }, // { Reference(Organization) }, // C? Organization that is associated with the contact
        period: { type: periodSchema } // The period during which this contact person or organization is valid to be contacted relating to this patient
      }
    ],
    communication: [
      {
        // A language which may be used to communicate with the patient about his or her health
        language: { type: codeableConceptSchema }, // R!  The language which can be used to communicate with the patient about his or her health
        preferred: Boolean // Language preference indicator
      }
    ],
    generalPractitioner: { type: referenceSchema }, // [{ Reference(Organization|Practitioner|  PractitionerRole) }], // Patient's nominated primary care provider
    managingOrganization: { type: referenceSchema }, // Reference(Organization)  Organization that is the custodian of the patient record
    link: [
      {
        // Link to another patient resource that concerns the same actual person
        other: { type: referenceSchema }, // R!  The other patient or related person resource that the link refers to
        type: {
          type: String,
          enum: ['replaced-by', 'replaces', 'refer', 'seealso']
        } // R!  replaced-by | replaces | refer | seealso
      }
    ]
  },
  { collection: 'Patient' }
)

module.exports = mongoose.model('Patient', patientSchema)
module.exports = patientSchema
