const companyModel = require("../models/companyModel");
const materialsModel = require("../models/materialsModel");
const userModel = require("../models/userModel");
const materialsRouter = require('express').Router();


materialsRouter.post('/addMaterial', async (req, res) => {
    try {
        const user = await userModel.findById(req.session.user._id)
        let newMaterials = new materialsModel(req.body);
        newMaterials.validateSync();
        await newMaterials.save();
        if (req.body.option == "wasted") {
            await companyModel.updateOne({_id : user.company}, {$push : {wasteMaterials : newMaterials._id}})
        }else if(req.body.option == "needed"){
            await companyModel.updateOne({_id : user.company}, {$push : {materialsNeeded : newMaterials._id}})
        }else{
            await companyModel.updateOne({_id : user.company}, {$push : {products : newMaterials._id}})
        } 
        req.session.messages = "Le matériau a bien été ajouté";    
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
        req.session.errors = error.errors;
        res.redirect("/dashboard");
    }
});


materialsRouter.get('/updateMaterial/:id', async (req, res) => {
    try {     
        const materialId = req.params.id;
        const material = await materialsModel.findById(materialId);
        res.render('/materials/materialsForm.twig', { material: material });
    } catch (error) {
        console.log(error);
        res.send("Une erreur s'est produite lors du chargement du formulaire de mise à jour de matériau.");
    }
});

materialsRouter.get('/material/:id', async (req, res) => {
    try {     
        const materialId = req.params.id;
        const material = await materialsModel.findById(materialId);
        res.json(material);
    } catch (error) {
        
        res.send("Une erreur s'est produite lors du chargement du formulaire de mise à jour de matériau.");
    }
});

materialsRouter.post('/updateMaterial/:id', async (req, res) => {
    try {
        await materialsModel.updateOne({ _id: req.params.id }, req.body);
        req.session.messages = "Matériau a bien été modifié";
    } catch (error) {
        req.session.errors = error.errors;
    }
    res.redirect("/dashboard");
})


materialsRouter.get('/deleteMaterial/:type/:id', async (req, res) => {
    try {
        const type = req.params.type;
        const materialId = req.params.id;
        
        await materialsModel.deleteOne({ _id: materialId });
            
        let updateField = '';
        if (type == 'waste') {
            updateField = 'wasteMaterials';
        } else if (type == 'needed') {
            updateField = 'materialsNeeded';
        } else if (type == 'product') {
            updateField = 'products';
        }
        await companyModel.updateOne({ _id: req.session.user.company }, { $pull: { [updateField]: materialId } });
        
        req.session.messages = "Le matériau a bien été supprimé";
    } catch (error) {
        req.session.errors = error.errors;
    }
    res.redirect("/dashboard");
});

module.exports = materialsRouter;