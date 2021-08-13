const express = require("express");
const router = express.Router();
const { Patient } = require("../models/patient");

router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.send("Error " + err);
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  const patient = Patient(req.body);
  // const patient = Patient({
  //   resourceType: req.body.resourceType,
  //   // _id: req.body.id,
  //   id: req.body.id,
  //   meta: req.body.meta,
  //   text: req.body.text,
  //   identifier: req.body.identifier, // An identifier for this patient
  //   active: req.body.active, // Whether this patient's record is in active use
  //   name: req.body.name, // A name associated with the patient
  //   telecom: req.body.telecom, // A contact detail for the individual
  //   gender: req.body.gender, // male | female | other | unknown
  //   birthDate: req.body.birthDate, // The date of birth for the individual
  //   // deceased[x]: Indicates if the individual is deceased or not. One of these 2:
  //   deceasedBoolean: req.body.deceasedBoolean,
  //   deceasedDateTime: req.body.deceasedDateTime,
  //   address: req.body.address, // An address for the individual
  //   maritalStatus: req.body.maritalStatus, // Marital (civil) status of a patient
  //   // multipleBirth[x]: Whether patient is part of a multiple birth. One of these 2:
  //   multipleBirthBoolean: req.body.multipleBirthBoolean,
  //   multipleBirthInteger: req.body.multipleBirthInteger,
  //   photo: req.body.photo, // Image of the patient
  //   contact: req.body.contact,
  //   communication: req.body.communication,
  //   generalPractitioner: req.body.generalPractitioner, //[{ Reference(Organization|Practitioner|  PractitionerRole) }], // Patient's nominated primary care provider
  //   managingOrganization: req.body.managingOrganization, // Reference(Organization)  Organization that is the custodian of the patient record
  //   link: req.body.link,
  // });
  try {
    const patientElement = await patient.save();
    res.json(patientElement);
  } catch (err) {
    res.send("Error");
    console.log(err);
  }
});

module.exports = router;
