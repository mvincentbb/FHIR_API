const express = require('express')
const router = express.Router()
const PatientSchema  = require('../models/patient')


router.get('/', async (req, res) => {
    try{
        const patients = await PatientSchema.find()
        res.json(patients)
    }catch(err){
        res.send('Error ' + err)
    }
})

router.post('/', async(req,res) => {
    const patients = new PatientSchema({
        
    })
})