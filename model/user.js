const { Schema, model } = require("mongoose");
const { createHmac,randomBytes } = require('crypto');
const { constants } = require("fs/promises");


const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true
    },
    email: {
      required: true,
      unique: true
    },
    salt: {
      type: String,
      requred: true
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
    role:{
        type: String,
        enum:("USER","ADMIN"),
        default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function(next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex")

})

const User = model("user", userSchema);

module.exports = User;
