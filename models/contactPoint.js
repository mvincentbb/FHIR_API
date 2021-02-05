// Details for all kinds of technology-mediated contact points for a person or organization, including telephone, email,

const mongoose = require('mongoose')
const  Schema  = mongoose.Schema
const periodSchema = require('./period')

const contactPointSchema = new Schema({
        _id: false,
        // from Element: extension
        system: { type: String, enum: ['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'] }, // C? phone | fax | email | pager | url | sms | other
        value: { type: String }, // The actual contact point details
        use : { type: String, enum: ['home', 'work', 'temp', 'old', 'mobile'] }, // home | work | temp | old | mobile - purpose of this contact point
        rank : { type: String, match: /^[1-9]\d*$/  },//<positiveInt>, // Specify preferred order of use (1 = highest)
        period : { type: periodSchema } // Time period when the contact point was/is in use

})

module.exports = mongoose.model('ContactPoint', contactPointSchema )
module.exports = contactPointSchema