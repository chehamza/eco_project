const mongoose = require('mongoose');
const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
    },
    description: String,
    quantity: Number,
    price: Number,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'companies'
    }
});

const materialModel = mongoose.model('materials', materialSchema);
module.exports = materialModel;