const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { isEmail } = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [isEmail, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },

    phone: {
      type: String,
      trim: true,
    },

    organization: {
      type: String,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

//Password Hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return typeof next === "function" ? next() : undefined;
  }

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  if (typeof next === "function") {
    next();
  }
});

//Static user login method
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password,user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

module.exports = mongoose.model("User", userSchema);