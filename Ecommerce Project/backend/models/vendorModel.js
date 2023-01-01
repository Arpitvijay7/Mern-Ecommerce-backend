const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const vendorSchema = new mongoose.Schema({
    name : {
        type: 'String',
        required : [true , "Please enter your name"],
        maxLenght : [30 ,"Name cannot exceed 30 characters"],
        minLenght : [4, "Name should have more than 4 characters"],
    },
    email: {
        type: 'String',
        required: [true, "Please Enter Your Email"],
        unique : true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
    },

    address: {
        type: String,
        required: [true, 'Please add address']
    },

    status : {
        type: String,
        default: "unapproved"
    },
    
    createdAt: {
    type: Date,
    default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

});

vendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  let salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare Password
vendorSchema.methods.comparePassword = async function (enteredPassword) {
  let result = await bcrypt.compare(enteredPassword, this.password);
  console.log(result);
  return result;
};

// Generating Password Reset Token
vendorSchema.methods.getResetPasswordToken = async function () {
  // Generating Password Reset Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

vendorSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

module.exports = mongoose.model("Vendor", vendorSchema);



