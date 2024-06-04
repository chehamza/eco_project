const companyModel = require("../models/companyModel");
const userModel = require("../models/userModel");
const materialsModel = require("../models/materialsModel");
const companyRouter = require('express').Router();
const authGuard = require("../services/authGuard");
const evaluationModel = require("../models/evaluationModel");
companyRouter.post('/addCompany', async (req, res) => {
    try {

        let newCompany = new companyModel(req.body);
        newCompany.validateSync();
        await newCompany.save();
        await userModel.updateOne({ _id: req.session.user._id }, { company: newCompany });
        res.redirect("/dashboard");
    } catch (error) {
     
        req.session.errors = error.errors;
        res.redirect("/dashboard");
    }
});
companyRouter.get('/annuaire', authGuard(false), async (req, res) => {
    try {
        let query = {};
        if (req.query.searchType && req.query.keyword) {
            if (req.query.searchType != 'activity') {
                let name = {$regex: new RegExp(req.query.keyword,'i')}
                const materials = await materialsModel.find({ name: name }).distinct('_id');
                query[req.query.searchType] = { $in: materials };
            }else{
                query.activity = {$regex: new RegExp(req.query.keyword,'i')}
            }
        }
        const companies = await companyModel.find(query).populate('products materialsNeeded wasteMaterials evaluations');
        const isAdmin = req.session.user.isAdmin;
        const showHeader = isAdmin ? true : false;
        res.render('annuaire/annuaireView.twig', { companies,showHeader,isAnnuairePage: true });
    } catch (error) {
        console.error(error);
        res.send('Erreur interne du serveur');
    }
});

companyRouter.get('/home-annuaire', async (req, res) => {
    try {
        const companies = await companyModel.find()
            .populate('products materialsNeeded wasteMaterials evaluations')
            .exec();
        res.render('homeAnnuaire/homeAnnuaire.twig', { companies: companies });
    } catch (error) {
        console.error(error);
        res.send('Erreur interne du serveur');
    }
});



companyRouter.post('/addReview/:companyId', authGuard(false), async (req, res) => {
    try {  
        const review = new evaluationModel(req.body);
        review.evaluatedCompany = req.params.companyId
        review.evaluatorCompany = req.session.user._id    
        review.validateSync();
        console.log(review);
        await review.save();
        await companyModel.updateOne({ _id: req.params.companyId }, { $push: { evaluations: review._id }, average: (this.average ? this.average : 5 + parseInt(req.body.stars)) / 2 })
        let company = await companyModel.findById(req.session.user.company).populate({ path: 'evaluations' });
        await userModel.updateOne(
            { _id: req.session.user._id },
            {
                $push: { evaluatedCompanies: req.params.companyId},
            }
        ); res.redirect('/annuaire')
    } catch (error) {
        res.render('annuaire/annuaireView.twig',{
            error: error,
        })
    }
})

companyRouter.get('/updateCompany/:id', authGuard(false), async (req, res) => {
    try {
        let company = await companyModel.findOne({ _id: req.params.id });
        res.render("addCompany/addCompany.twig", {
            company: company
        })
    } catch (error) {
        req.session.errors = error.errors;
        res.redirect("/dashboard");
    }
})
companyRouter.post('/updateCompany/:id', authGuard(false), async (req, res) => {
    try {
        await companyModel.updateOne({ _id: req.params.id }, req.body);
        req.session.messages = "L'entreprise a bien été modifié";
       
    } catch (error) {
        req.session.errors = error.errors;
    }
    res.redirect("/dashboard");
})



companyRouter.get('/deleteCompany/:id', authGuard(false), async (req, res) => {
    try {
        
        if (req.session.user.isAdmin) {
            
            await companyModel.deleteOne({ _id: req.params.id });
            await userModel.deleteOne({ company: req.params.id });
            req.session.messages = "Cette entreprise a bien été supprimée";         
            return res.redirect("/annuaire");
        } else {
            
            const company = await companyModel.findOne({ _id: req.params.id, _id: req.session.user.company});
            if (!company) {
                throw new Error("not authorized");
            }         
            await companyModel.deleteOne({ _id: req.params.id });
            await userModel.deleteOne({ _id: req.session.user._id });
            req.session.messages = "Cette entreprise a bien été supprimée";     
            
            return res.redirect("/dashboard");
        }
    } catch (error) {
        req.session.errors = error.message;
        res.redirect("/dashboard");
    }
});


companyRouter.get('/logout', async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        res.send(error)
    }
})


module.exports = companyRouter;
