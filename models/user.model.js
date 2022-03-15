const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "Please add first name"],
    trim: true
  },
  lastName: {
      type: String,
      required: [true, "Please add last name"],
      trim: true
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    trim: true
  },
  phoneNumber:{
    type: String,
    required: [true, "Please add the phone number"],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Please add the password"],
    trim: true
  },
  dob: {
    type: String,
    required: [true, "Please add the date of birth."]
  },
  avatar: {
    type: String,
    trim: true,
    default:'https://i.imgur.com/FPnpMhC.jpeg',
  },
  role: {
    type: String,
    default: 'ROLE_MEMBER',
    enum: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SELLER']
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref : "Product"
    }
  ]
},
{
  timestamps: true
})

/**
 * Before saving hash and salt the password if it has been modified
 */
userSchema.pre("save", async function (next) {
  try {
      if(this.isModified("password")){
          const hash = await bcrypt.hash(this.password, 8);
          this.password = hash;
      }
      next();
  } catch (err) {
      next(err);
  }
});

/**
 * Compare the hashed password with the password provided
 */
userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
      bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
          return reject(err);
      }
      resolve(same);
      });
  });
};

const User = mongoose.model('User', userSchema)

module.exports = User;