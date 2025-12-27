const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username cannot be blank'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email cannot be blank'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password cannot be blank'],
    minlength: [8, 'Password must be at least 8 characters']
  }
});


userSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

    
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;