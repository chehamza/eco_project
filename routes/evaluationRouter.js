const express = require('express');
const evaluationRouter = express.Router();
const evaluationModel = require('../models/evaluationModel');
const companyModel = require('../models/companyModel'); 
const authGuard = require("../services/authGuard");


evaluationRouter.get('/deleteEvaluation/:companyId/:evaluationId', authGuard(false), async (req, res) => {
    try {  
        const evaluationId = req.params.evaluationId;
        const companyId = req.params.companyId;

        await evaluationModel.deleteOne({ _id: evaluationId });
        await companyModel.updateOne({ _id: companyId }, { $pull: { evaluations: evaluationId } });
        req.session.messages = "L'évaluation a été supprimée avec succès.";
        res.redirect("/annuaire");
    } catch (error) {
        req.session.errors = error.errors;
        res.redirect("/annuaire");
    }
});

module.exports =  evaluationRouter;
