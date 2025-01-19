const { Schema, model, Error } = require("mongoose");
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
      enum: ["USER", "ADMIN"], // Ensure USER is included
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

userSchema.static('matchPassword', function (email, password) {
  const user = this.findOne({email});
  if(!user) throw new Error('User not found');

  const salt = "someRandomSalt";
  const hashedPassword = user.password;

  const userProvideHash = createHmac("sha256", salt)
  .update(password)
  .digest("hex")

  if(hashedPassword !== userProvideHash) throw new Error('incorrect password')

  return {...user, password: undefined, salt: undefined};
})

const User = model("user", userSchema);

module.exports = User;
