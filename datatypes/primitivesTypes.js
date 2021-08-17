const mongoose = require("mongoose");

const fhirPrimitivesTypesRegex = {
  timeRegex: /^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?$/g,
  codeRegex: /^[^\s]+(\s[^\s]+)*$/g,
  positiveIntRegex: /^[1-9][0-9]*$/g,
  unsignedIntRegex: /^[0-9][0-9]*$/g,
  dateRegex: /([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$/g,
  dateTimeRegex: /([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?$/g,
};

// time
class Time extends mongoose.SchemaType {
  constructor(key, option) {
    super(key, option, "Time");
  }
  cast(value) {
    let _value = String(value);
    if (!fhirPrimitivesTypesRegex.timeRegex.test(value)) {
      throw new Error("Time:" + value + " is not an Positive or null number ");
    }
    return _value;
  }
}

//code
class Code extends mongoose.SchemaType {
  constructor(key, option) {
    super(key, option, "Code");
  }
  cast(value) {
    let _value = String(value);
    if (!fhirPrimitivesTypesRegex.codeRegex.test(value)) {
      throw new Error("Code:" + value + " is not a Valide code ");
    }
    return _value;
  }
}

//positiveInt

class PositiveInt extends mongoose.SchemaType {
  constructor(key, option) {
    super(key, option, "PositiveInt");
  }
  cast(value) {
    let _value = String(value);
    if (!fhirPrimitivesTypesRegex.positiveIntRegex.test(value)) {
      throw new Error("PositiveInt:" + value + " is not a Positive Integer ");
    }
    return _value;
  }
}

//date
class Date extends mongoose.SchemaType {
  constructor(key, option) {
    super(key, option, "Date");
  }
  cast(value) {
    let _value = String(value);
    if (!fhirPrimitivesTypesRegex.dateRegex.test(value)) {
      throw new Error("Date:" + value + " is not a Valide Date ");
    }
    return _value;
  }
}

//dateTime
class DateTime extends mongoose.SchemaType {
  constructor(key, option) {
    super(key, option, "DateTime");
  }
  cast(value) {
    const dateTimeRegex = /([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?$/g;
    let _value = String(value);
    if (!dateTimeRegex.test(value)) {
      throw new Error("DateTime:" + value + " is not a dateTime ");
    }
    return _value;
  }
}

class UnsignedInt extends mongoose.SchemaType {
  constructor(key, option) {
    super(key, option, "UnsignedInt");
  }
  cast(value) {
    const unsignedIntRegex = /^[0-9][0-9]*$/g;
    let _value = String(value);
    if (!unsignedIntRegex.test(value)) {
      throw new Error(
        "UnsignedInt:" + value + " is not an Positive or null number "
      );
    }
    return _value;
  }
}
mongoose.Schema.Types.UnsignedInt = UnsignedInt;
mongoose.Schema.Types.Time = Time;
mongoose.Schema.Types.Code = Code;
mongoose.Schema.Types.PositiveInt = PositiveInt;
mongoose.Schema.Types.Date = Date;
mongoose.Schema.Types.DateTime = DateTime;

module.exports = {
  Time,
  Code,
  PositiveInt,
  DateTime,
  Date,
  UnsignedInt,
};
