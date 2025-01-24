const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require('node:crypto');

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      unique: true
    },
    profileImageURl: {
      type: String,
      default: "/images/default.png"
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

// Password matching method
userSchema.methods.matchPassword = async function(enteredPassword) {
  const hashedPassword = createHmac("sha256", this.salt)
    .update(enteredPassword)
    .digest("hex");
  return hashedPassword === this.password;
};

const User = model("user", userSchema);

module.exports = User;
