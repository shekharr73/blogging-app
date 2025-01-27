const {Schema, model} = require('mongoose');
const { createHmac, randomBytes } = require('node:crypto');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema(
{
    fullName: {
        type: 'String',
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
        required: true // Fixed typo here
    },
    profileImageURL: {
        type: String,
        default: '/images/default.png',
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }
},
{ timestamps: true }
);

// Using pre middleware of mongoose
userSchema.pre('save', function() {
    const user = this;
    if (!user.isModified("password")) return;
    const newSalt = randomBytes(16).toString(); // Renamed variable
    const newHashedPassword = createHmac('sha256', newSalt)
    .update(user.password)
    .digest("hex");
    this.salt = newSalt;
    this.password = newHashedPassword;
});

// Making function
userSchema.static('matchPasswordAndGenerateToken', async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not found!');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    if (hashedPassword !== userProvidedHash) {
        throw new Error("Incorrect Password!");
    }
    const token = createTokenForUser(user);
    return token;
});

const User = model('user', userSchema);

module.exports = User;
