const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  personalInfo: { type: Object, default: {} },
  workExperience: { type: Array, default: [] },
  education: { type: Array, default: [] },
  skills: { type: Array, default: [] },
});

module.exports = mongoose.model('Resume', resumeSchema);
