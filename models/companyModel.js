const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    siret: {
        type: String,
        required: true,
        unique: true,validate: {
            validator: function (value) {
                return /^\d{14}$|^\d{3}\s?\d{3}\s?\d{3}\s?\d{5}$/.test(value);
            },
            message: "Le siret doit contenir 14 chiffres au format 123 123 123 12345 ou 12312312312312"
        }
    },
    email: {
        type: String,
        required: true, validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/
                .test(v)
            },
            message: "Entrez un mail valide"
        }
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },

    activity: {
        type: String,
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'materials'
        }
    ],
    materialsNeeded: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'materials'
        }
    ],
    wasteMaterials: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'materials'
        },
    ],
    average: {
        type: Number,
        min: 1,
        max: 5,
        default :5,
    },
    evaluations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'evaluations'
        },
    ],

});

companySchema.pre('save', function(next) {
    // Calcul de la moyenne des évaluations
    const evaluations = this.evaluations;
    if (evaluations.length > 0) {
        const totalRating = evaluations.reduce((acc, curr) => acc + curr.rating, 0);
        this.average = totalRating / evaluations.length;
    } else {
        this.average = 5; 
    }
    next();
});
const companyModel = mongoose.model("companies", companySchema);
module.exports = companyModel;

