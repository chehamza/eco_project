const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom est requis"],
    },
    email: {
        type: String,
        required: [true, "Le mail est requis"],
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est requis"],
       
    },
    isAdmin : {
        type: Boolean,
        default: false
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies",
    },
    evaluatedCompanies: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ]
});


userSchema.pre("save", function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    bcrypt.hash(this.password, 10, (error, hash) => {
        if (error) {
            return next(error);
        }
        this.password = hash;
        next();
    });
});
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
