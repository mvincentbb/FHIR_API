const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
// mongoose.connect(process.env.DB_HOST, {useNewUrlParser : true});
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true });
const con = mongoose.connection;

con.on("open", () => {
  console.log("connected ...");
});

app.use(express.json());

const patientRouter = require("./routes/patient.js");
app.use("/patient", patientRouter);
// const alienRouter = require('./routes/aliens')
// app.use('/aliens',alienRouter)

app.listen(8088, () => {
  console.log("server started on port 8088");
});
