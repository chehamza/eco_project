const userModel = require("../models/userModel");
const evaluationCount =require("../models/evaluationModel");
const userRouter = require('express').Router();
const bcrypt = require("bcrypt");
const authguard = require("../services/authGuard");
const companyModel = require("../models/companyModel");
const nodemailer = require('nodemailer');
require('dotenv').config();

userRouter.get('/', async (req, res) => {
    try {
        let errors = null;
        let adminId = req.session.adminId;
        if (req.session.errors) {
            errors = req.session.errors;
            delete req.session.errors;
        }
        res.render('home/index.html.twig', {
            errors: errors,
            adminId: adminId
        });
    } catch (error) {
        console.error("Erreur lors du traitement de la requête :", error);
        const errorMessage = "Erreur lors de la connexion au serveur.";
        req.session.errors = { server_error: errorMessage };
        res.redirect('/login');
    }
});

userRouter.get('/dashboard', authguard(false), async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await userModel.findById(userId).populate({
            path: 'company',
            populate: [
                { path: 'materialsNeeded' }, 
                { path: 'products' }, 
                { path: 'wasteMaterials' },
                { path: 'evaluations' }
            ]
        });       
        res.render('dashboard/dashboard.html.twig', {
            user: user,
            company : user.company,
            showHeader: true
        });
    } catch (error) {
        console.error("Erreur lors du traitement de la requête :", error);
        res.send("Une erreur s'est produite lors du rendu de la page de tableau de bord");
    }
});

userRouter.get('/addCompany', authguard(false), async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await userModel.findById(userId)
        res.render('addCompany/addCompany.twig', {
            user: user,
        });
    } catch (error) {
        console.error("Erreur lors du traitement de la requête :", error);
        res.send("Une erreur s'est produite lors du rendu de la page de tableau de bord");
    }
});
userRouter.get('/companyDetails/:id', async (req, res) => {
    try {
        const company = await companyModel.findById(req.params.id).populate([
            { path: 'materialsNeeded' }, 
            { path: 'products' }, 
            { path: 'wasteMaterials' },
            { path: 'evaluations', populate: "evaluatorCompany" }
        ]);
      
        res.render('companyDetails/companyDetails.twig', {
            company: company
        });
    } catch (error) {
        console.error("Erreur lors du traitement de la requête :", error);
        res.send("Une erreur s'est produite lors du rendu de la page de tableau de bord");
    }
});

userRouter.post('/signup', async (req,res) => {
    try {
        const existingMail = await userModel.findOne({ email: req.body.email });
        if (existingMail) {
            throw { email: "This email already exists" };
        }
        if (req.body.password != req.body.confirmPassword) {
            throw { confirmPassword: "Passwords don't match" };
        }
        const user = new userModel(req.body);
        await user.save();
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        res.render("signup/_formsignup.twig", {
            error: error,
        });
    }
});
userRouter.get('/signup',(req,res)=>{
    res.render('signup/_formsignup.twig',{ showHeader: false})
});

userRouter.post('/login', async (req, res)  => {
    try { 
        let user = await userModel.findOne({ email: req.body.email });
        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                req.session.user = user;
                if (user.isAdmin == true) {
                  
                    res.redirect('/annuaire');
                } else if (user.company != null) {
                    res.redirect('/dashboard');
                } else {
                    res.redirect('/addCompany');
                }
            } else {
                throw { password: "Mauvais mot de passe" };
            }
        } else {
            throw { email: "Cet utilisateur n'est pas enregistré" };
        }
    } catch (e) {
       
        res.render('login/_loginform.twig', {
            error: e,
        });
    }
});

userRouter.get('/homeAnnuaire', (req, res) => {
    res.render('homeAnnuaire/homeAnnuaire.twig');
});

userRouter.get('/login',(req,res)=>{
    res.render('login/_loginform.twig',{ showHeader:false })
});


userRouter.post('/sendMail', async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({

            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASS
            }
        });

        const { name, email, company, phone, message } = req.body;

        const mailOptions = {
            from: process.env.MAIL,
            to: process.env.PERSO_MAIL,
            subject: 'Nouveau message de ' + name + ' de ' + company,
            text: `Nom : ${name}\nEmail : ${email}\nEntreprise : ${company}\nTéléphone : ${phone}\nMessage : ${message}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail envoyé:', info.response);
        req.session.emailMessage = "Votre message a bien été envoyé";
        res.redirect('/#contact');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        req.session.emailMessage = "Une erreur est survenue lors de l'envoi de l'e-mail.";
        res.redirect('/#contact');
    }
});





module.exports = userRouter;
