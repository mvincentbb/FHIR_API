const mongoose = require('mongoose')
const  Schema  = moogoose.Schema
const identifierSchema = require('./identifier')
const humanNameSchema = require('./humanName')
const contactPointSchema = require('./contactPoint')
const codeableConceptSchema = require('./codeableConcept')
const attachementSchema = require('./attachement')
const addressSchema = require('./address')




const patientSchema = new Schema({
    

    resourceType : Patient,
    // from Resource: id, meta, implicitRules, and language
    // from DomainResource: text, contained, extension, and modifierExtension
    identifier : [{ identifierSchema }], // An identifier for this patient
    active : Boolean, // Whether this patient's record is in active use
    name : [{ humanNameSchema }], // A name associated with the patient
    telecom : [{ contactPointSchema }], // A contact detail for the individual
    gender :{type : String, enum : ['male', 'female', 'other', 'unknown']} , // male | female | other | unknown
    birthDate : {type : Date,}, // The date of birth for the individual
    // deceased[x]: Indicates if the individual is deceased or not. One of these 2:
    deceasedBoolean : {type : Date},
    deceasedDateTime : {type : Date},
    address : [{ addressSchema }], // An address for the individual
    maritalStatus : { codeableConceptSchema }, // Marital (civil) status of a patient
    // multipleBirth[x]: Whether patient is part of a multiple birth. One of these 2:
    multipleBirthBoolean : {type: Boolean,},
    multipleBirthInteger : { type: Number },
    photo : [{ attachementSchema }], // Image of the patient
    contact : [{ // A contact party (e.g. guardian, partner, friend) for the patient
      relationship : [{ codeableConceptSchema }], // The kind of relationship
      name : { humanNameSchema }, // A name associated with the contact person
      telecom : [{ contactPointSchema }], // A contact detail for the person
      address : { addressSchema }, // Address for the contact person
      gender : {type: String, enum: ['male', 'female', 'other', 'unknown']}, // male | female | other | unknown
      organization : { referenceSchema },//{ Reference(Organization) }, // C? Organization that is associated with the contact
      period : { periodSchema } // The period during which this contact person or organization is valid to be contacted relating to this patient
    }],
    communication : [{ // A language which may be used to communicate with the patient about his or her health
      language : { codeableConceptSchema }, // R!  The language which can be used to communicate with the patient about his or her health
      preferred : Boolean // Language preference indicator
    }],
    generalPractitioner :{ referenceSchema } ,//[{ Reference(Organization|Practitioner|  PractitionerRole) }], // Patient's nominated primary care provider
    managingOrganization : { referenceSchema }, // Reference(Organization)  Organization that is the custodian of the patient record
    link : [{ // Link to another patient resource that concerns the same actual person
      other : {referenceSchema}, // R!  The other patient or related person resource that the link refers to
      type : {type: String, enum: ['replaced-by', 'replaces', 'refer', 'seealso']} // R!  replaced-by | replaces | refer | seealso
    }]
        
      


})

module.exports = mongoose.model('Patient', patientSchema)