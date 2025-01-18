const { Schema, model } = require("mongoose");

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

const User = model("user", userSchema);

module.exports = User;
