const {Consultation, Doctor, MedicalRecord, Patient, Receipt, Specialist, User} = require('../models/index');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');

class Controller {
    static async landingPage(req, res){
        try {
            if(req.session.userId && req.session.role === 'doctor'){
                res.redirect('/doctor');
            } else if(req.session.userId && req.session.role === 'patient'){
                res.redirect('/patient');
            } else{
                res.render('landing-page');
            }
        } catch (error) {
            res.send(error);
        }
    }
    //login
    static async renderLogin(req, res){
        try{
            if(req.session.userId && req.session.role === 'doctor'){
                res.redirect('/doctor');
            } else if(req.session.userId && req.session.role === 'patient'){
                res.redirect('/patient');
            }
            let {error} = req.query;
            console.log(error);
            res.render('login',{error});
        } catch(error) {
            res.send(error);
        }
    }
    static async handlerLogin(req, res){
        try{
            let {username, password} = req.body;
            if(!username || !password){
                throw {errLoginValidate: 'Username or password cannot empty'};
            }
            let dataLogin = await User.findOne({
                where: {
                    username: username
                }
            })
            if(!dataLogin){
                throw {errLogin: `Cannot login`}
            }
            let passwordFromDB = dataLogin.password;
            let checkPassword = bcrypt.compareSync(password, passwordFromDB);
            // console.log(dataLogin[0], '<----');
            if(!checkPassword){
                throw {errLogin: `Cannot login`}
            }
            req.session.userId = dataLogin.id;
            req.session.role = dataLogin.role;
            if(dataLogin.role === 'doctor'){
                res.redirect('/doctor');
            } else if(dataLogin.role === 'patient'){
                res.redirect('/patient')
            }
        } catch(error) {
            if(error.errLogin){
                // res.send(error.errLogin);
                res.redirect(`/login?error=${error.errLogin}`);
            }else if(error.errLoginValidate){
                res.redirect(`/login?error=${error.errLoginValidate}`)
            }else{
                res.send(error);
            }
        }
    }
    //signup
    static async renderSignup(req, res){
        try {
            res.send('render signup');
        } catch (error) {
            res.send(error);
        }
    }
    static async handlerSignup(req, res){
        try {
            res.send('handler signup');
        } catch (error) {
            res.send(error);
        }
    }

    //doctor
    static async homeDoctor(req, res){
        try {
            let {error} = req.query;
            console.log(error);
            res.send('home doctor');
        } catch (error) {
            res.send(error);
        }
    }


    //patient
    static async homePatient(req, res){
        try {
            let {error} = req.query;
            console.log(error);
            res.send('home patient');
        } catch (error) {
            res.send(error);
        }
    }

}

module.exports = Controller;