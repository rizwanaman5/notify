const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    endpoint: { type: String, unique: true },
    keys: { type: mongoose.Schema.Types.Mixed },
    createDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
