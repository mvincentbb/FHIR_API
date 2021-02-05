/*
An address expressed using postal conventions 
(as opposed to GPS or other location definition formats). 
This data type may be used to convey addresses for use in delivering mail 
as well as for visiting locations which might not be valid for mail delivery. 
There are a variety of postal address formats defined around the world.
*/

const mongoose = require('mongoose')
const  Schema  = mongoose.Schema
const periodSchema = require('./period')

const addressSchema = new Schema({
    _id: false,
    use : { type: String, enum: ['home', 'work', 'temp', 'old', 'billing'] }, // home | work | temp | old | billing - purpose of this address
    type : { type: String, enum: ['postal', 'physical', 'both'] }, // postal | physical | both
    text : { type: String }, // Text representation of the address
    line : [{ type: String }], // Street name, number, direction & P.O. Box etc.
    city : { type: String }, // Name of city, town etc.
    district : { type: String }, // District name (aka county)
    state : { type: String }, // Sub-unit of country (abbreviations ok)
    postalCode : { type: String }, // Postal code for area
    country : { type: String }, // Country (e.g. can be ISO 3166 2 or 3 letter code)
    period : { type: periodSchema } // Time period when address was/is in use

})

 
module.exports = mongoose.model('Address', addressSchema )
module.exports = addressSchema