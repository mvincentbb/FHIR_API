const mongoose = require('mongoose')
const  Schema  = mongoose.Schema
const codingSchema = require('./coding')

const metaSchema = Schema({
          _id: false,
          versionId: {type: String},
          _versionId: {type: String},
          lastUpdated: { type: String, match: /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\\.[0-9]+)?(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))$/g, },
          _lastUpdated: { type: String, match: /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\\.[0-9]+)?(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))$/g, },
          source: { type: String },
          _source: { type: String },
          profile: [{ type: String}],
          security: [{ codingSchema }],
          tag: [{ codingSchema }],
          
})



module.exports = mongoose.model('Meta', metaSchema )
module.exports = metaSchema