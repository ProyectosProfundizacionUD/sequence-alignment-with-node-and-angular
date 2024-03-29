const mongoose = require('mongoose')

const sequenceSchema = mongoose.Schema({
  organism: String,
  identifier: String,
  head: String,
  sequence: String,
  description: String,
  length: Number,
  imgUrl: String,
  creationDate: { type: Date, default: Date.now }
});

const sequence = mongoose.model('sequences', sequenceSchema);

module.exports = sequence;