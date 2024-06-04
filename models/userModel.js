const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Indiquez le nom de votre entreprise."]   
     },
    email: {
        type: String,
        required: [true, "Le mail est requis"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/
                .test(v)
            },
            message: "Entrez un mail valide"
        }
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est requis"],   
        validate: {
            validator: function (v) {
                return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-/]).{8,}$/.test(v)
            }, message: "Entrez un mot de passe valide :<br>  8 caractère minimum, une majuscule,<br> une minuscule et un caractère spécial"
        }
       
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
