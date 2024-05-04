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
    required: [true, "comment is required"]
  },
  stars: {
    type: Number,
    required: [true, " Evaluation is required"],
    min: [1, "L'évaluation doit être d'au moins une étoile"],
    max: 5
  },
  date: {
    type: Date,
    required: [true, "date is requied"],
    validate: {
      validator: function(value) {
        return value > new Date(); 
      },
      message: "La date d'expérience n'est pas valide"
    }
  }
  
});

const evaluationModel = mongoose.model('evaluations', evaluationSchema);

module.exports = evaluationModel;
