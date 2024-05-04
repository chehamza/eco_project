const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const userRouter = require("./routes/userRouter")
const companyRouter = require("./routes/companyRouter");
const materialsRouter = require("./routes/materialsRouter");
const evaluationRouter = require("./routes/evaluationRouter");
require('dotenv').config();



const app = express();

app.use(express.static("assets"));
app.use(session({
    secret: process.env.classified_session,
    resave: false,
    saveUninitialized: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.locals.session = req.session
    next()
})
app.use(userRouter);
app.use(companyRouter);
app.use(materialsRouter);
app.use(evaluationRouter);





app.listen(process.env.PORT, (err) => {
    console.log(err ? err : `Success! Connected to server on port ${process.env.PORT}`);
});



try {
    mongoose.connect(process.env.BDD_URI);
    console.log("connecté à la base de donnée");
} catch (error) {
    console.log(error);
}

