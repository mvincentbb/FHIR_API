const mongoose = require('mongoose')
const attachmentSchema = require('./attachement')
const codeableConceptSchema = require('./codeableConcept')
const contactPointSchema = require('./contactPoint')
const identifierSchema = require('./identifier')
const metaSchema = require('./meta')
const periodSchema = require('./period')
const referenceSchema = require('./reference')
const textSchema = require('./text')
const  Schema  = mongoose.Schema

const healthcareServiceSchema = Schema({

  resourceType : {
      type: referenceSchema,
      required: true,
      validate:{
          validator: {
              function (value) {
                return value === 'HealthcareService'                  
              }
          }
      }

  },
  meta: { type: metaSchema },
  text: { type: textSchema },
  // from Resource: id, meta, implicitRules, and language
  // from DomainResource: text, contained, extension, and modifierExtension
  identifier: [{ type: identifierSchema }], // External identifiers for this item
  active : { type: Boolean }, // Whether this HealthcareService record is in active use
  _active : { type: Boolean }, // Whether this HealthcareService record is in active use
  providedBy : { 
    type: referenceSchema,
    validate: {
        validator: function (value) {
            const typeOfReferenceRegex = /^(Organisation\/)(\S)+$/g
            return typeOfReferenceRegex.test(value.reference) 
        
        }
    }
 }, // Organization that provides this service
  category : [{ type: codeableConceptSchema }], // Broad category of service being performed or delivered
  type : [{ type: codeableConceptSchema }], // Type of service that may be delivered or performed
  specialty : [{ type: codeableConceptSchema }], // Specialties handled by the HealthcareService
  location : [{ 
    type: referenceSchema,
    validate: {
        validator: function (value) {
            const typeOfReferenceRegex = /^(Location\/)(\S)+$/g
            return typeOfReferenceRegex.test(value.reference) 
        
        }
    }
 }], // Location(s) where service may be provided
  name : {type: String }, // Description of service as presented to a consumer while searching
  _name : {type: String }, // Description of service as presented to a consumer while searching
  comment : { type: String }, // Additional description and/or any specific issues not covered elsewhere
  _comment : { type: String }, // Additional description and/or any specific issues not covered elsewhere
  extraDetails : { type: String }, // Extra details about the service that can't be placed in the other fields
  _extraDetails : { type: String }, // Extra details about the service that can't be placed in the other fields
  photo : { type: attachmentSchema }, // Facilitates quick identification of the service
  telecom : [{ type: contactPointSchema }], // Contacts related to the healthcare service
  coverageArea : [{ 
    type: referenceSchema,
    validate: {
      validator: function (value) {
          const typeOfReferenceRegex = /^(Location\/)(\S)+$/g
          return typeOfReferenceRegex.test(value.reference) 
      }
  }
   }], // Location(s) service is intended for/available to
  serviceProvisionCode : [{ type: codeableConceptSchema }], // Conditions under which service is available/offered
  eligibility : [{ // Specific eligibility requirements required to use the service
    code : { type: codeableConceptSchema }, // Coded value for the eligibility
    comment : { type: String } // Describes the eligibility conditions for the service
  }],
  program : [{ type: codeableConceptSchema }], // Programs that this service is applicable to
  characteristic : [{  type: codeableConceptSchema }], // Collection of characteristics (attributes)
  communication : [{  type: codeableConceptSchema }], // The language that this service is offered in
  referralMethod : [{  type: codeableConceptSchema }], // Ways that the service accepts referrals
  appointmentRequired : Boolean, // If an appointment is required for access to this service
  availableTime : [{ // Times the Service Site is available
    daysOfWeek : [{ type: String, enum : ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']}], // mon | tue | wed | thu | fri | sat | sun
    allDay : Boolean, // Always available? e.g. 24 hour service
    availableStartTime : { type: String, match: /^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?$/g }, // Opening time of day (ignored if allDay = true)
    availableEndTime : {type: String, match: /^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?$/g} // Closing time of day (ignored if allDay = true)
  }],
  notAvailable : [{ // Not available during this time due to provided reason
    description : String , // R!  Reason presented to the user explaining why time not available
    during : { type: periodSchema } // Service not available from this date
  }],
  availabilityExceptions : String, // Description of availability exceptions
  endpoint : [{ 
    type: referenceSchema,
    validate: {
      validator: function (value) {
          const typeOfReferenceRegex = /^(Endpoint\/)(\S)+$/g
          return typeOfReferenceRegex.test(value.reference) 
      }
  }
   }] // Technical endpoints providing access to electronic services operated for the healthcare service
},
{
    collection: 'HealthcareService'
})


module.exports = mongoose.model('HealthcareService', healthcareServiceSchema )
module.exports = healthcareServiceSchema