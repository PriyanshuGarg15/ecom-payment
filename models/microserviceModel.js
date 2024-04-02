const mongoose = require('mongoose');

// schema for microservices endpoints
const microserviceSchema = new mongoose.Schema({
  method: { type: String, required: true },
  host: { type: String, required: true },
  path: { type: String, required: true },
  name: { type: String, required: true }
});

// model based on schema
const Microservice = mongoose.model('Microservice', microserviceSchema);

module.exports = Microservice;