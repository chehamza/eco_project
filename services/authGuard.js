const userModel = require('../models/userModel')

const authguard = (role) => {
    return async (req, res, next) => {
        try {
            if (req.session.user) {
                let user = await userModel.findOne({ _id: req.session.user._id });
                if (user ) {
                    if (role == true ) {
                        if(user.isAdmin == role){
                            req.session.user = user
                            return next(); 
                        }
                    }else{
                        req.session.user = user
                        return next(); 
                    }
                }
            }
            res.redirect('/login');
        } catch (error) {
            res.send("Une erreur s'est produite lors de l'authentification");
            res.redirect('/login');
        }
    };
};

module.exports = authguard;