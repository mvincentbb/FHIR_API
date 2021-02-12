const mongoose = require('mongoose')
const  Schema  = mongoose.Schema

// time
const time = Schema({
    type: String, match: /^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?$/g 
})
//code

const code = Schema ({ 
    type: String, match: /^[^\s]+(\s[^\s]+)*$/g
 })

 //positiveInt
const positiveInt = Schema({
    type: String, match: /^[1-9][0-9]*$/g
})
// unsignedInt
const unsignedInt = Schema({
    type: String, match: /^[0-9][0-9]*$/g
})
//dateTime
const dateTime = Schema({
    type: String,
    match:
})

//instant

class UnsignedInt extends mongoose.SchemaType{
    constructor(key, option){
        super(key, option, 'UnsignedInt')
    }
    cast(value){
        const unsignedIntRegex = /^[0-9][0-9]*$/g
        let _value = String(value)
        if(_value.test(unsignedIntRegex)){
            throw new Error('UnsignedInt:' + value + ' is not an Positive or null number ' )
        }
        return _value
    }
}
mongoose.Schema.Types.UnsignedInt = UnsignedInt
module.exports = {
    UnsignedInt: UnsignedInt,
    
}