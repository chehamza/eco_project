const mongoose = require('mongoose');
const evaluationSchema = new mongoose.Schema({
  evaluatedCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'companies',
    required: true
  },
  evaluatorCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  comment: {
    type: String,
    required: [true, "un commentaire est requis"]
  },
  stars: {
    type: Number,
    required: [true, " Evaluation est requise"],
    min: [1, "L'évaluation doit être d'au moins une étoile"],
    max: 5
  },
  date: {
    type: Date,
    required: [true, "date est requis"],
    validate: {
      validator: function(value) {
        return value < new Date(); 
      },
      message: "La date d'expérience n'est pas valide"
    }
  }
  
});

const evaluationModel = mongoose.model('evaluations', evaluationSchema);

module.exports = evaluationModel;
