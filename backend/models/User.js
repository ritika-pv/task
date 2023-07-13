const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({


    username: {
        type: String,
        required: [true, "Please enter a username"],
        unique: [true, "Email already exists"],
    },


    firstName: {
        type: String,
        required: [true, "Please enter first name"],
    },


    lastName: {
        type: String,
        required: [true, "Please enter last name"],
    },


    email: {
        type: String,
        required: [true, "Please enter last name"],
        unique: [true, "Email already exists"],
    },


    password: {
        type: String,
        required: [true, "Please enter a password"],
        minilength: [6, "Password must be atleast 6 characters "],
        select: false,
    },


    phone: {
        type: String,
        required: true
    },


    userStatus: {
        type: Number,
        enum:[0,1],
        //enum property  restricts the possible values to 0 and 1.
        default:0,
        //0 for existing
        //1 for deleted
    }

});

//hashing the password before saving the user
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {//avoiding the hashed password to hash again
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
})

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_Secret);
};
module.exports = mongoose.model("User", userSchema);