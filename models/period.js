const mongoose = require('mongoose')
const  Schema  = moogoose.Schema

const periodSchema = Schema({
        start: { type: Date }, // C? Starting time with inclusive boundary
        end: { type: Date } // C? End time with inclusive boundary, if not ongoing

})


module.exports = mongoose.model('Period', periodSchema )
module.exports = periodSchema
