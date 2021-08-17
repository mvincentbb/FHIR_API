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
