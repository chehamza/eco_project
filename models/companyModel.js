const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    siret: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
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

const companyModel = mongoose.model("companies", companySchema);
module.exports = companyModel;

