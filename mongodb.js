const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
mongoose
  .connect(process.env.mongoURL)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("Connection failed");
  });
const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
});
const signinschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
});

const buynowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    enum: ["India", "United States", "Japan", "Greece"],
  },
  selectcar: {
    type: String,
    required: true,
    enum: [
      "titan_strike",
      "cyclone_x1",
      "nebula_glide",
      "pheonix_pulse",
      "viper_wave",
      "electra_fury",
      "aurora_spire",
      "turbo_blitz",
      "supra",
      "raptor_x",
      "velocity_gt",
    ],
  },
  phone: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
  },
  selectaservice: {
    type: String,
    required: true,
    enum: [
      "Diagnostic Test",
      "Engine Servicing",
      "Tire Replacement",
      "Vacuum Cleaning",
    ],
  },
  date: {
    type: String,
    required: true,
  },
  specialrequest: {
    type: String,
    required: true,
  },
});

const getaquoteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  budget: {
    type: String,
    enum: ["$1000-$5000", "$5000-$10,000", "$10,000+"],
    required: true,
  },
  timeline: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
  },
});

const collection = new mongoose.model("Collection1", loginSchema);
const collection1 = new mongoose.model("Collection2", buynowSchema);
const collection2 = new mongoose.model("Collection3", bookingSchema);
const collection3 = new mongoose.model("Collection4", getaquoteSchema);

module.exports = { collection, collection1, collection2, collection3 };
