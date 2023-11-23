const {Consultation, Doctor, MedicalRecord, Patient, Receipt, Specialist, User} = require('../models/index');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');

class Controller {
    static async tes(req, res){
        try {
            let data = await User.findAll();
            res.send(data);
        } catch (error) {
            res.send(error);
        }
    }
    //login
    static async renderLogin(req, res){
        try{
            res.render('login');
        } catch(error) {
            res.send(error);
        }
    }
    static async handlerLogin(req, res){
        try{
            let {username, password} = req.body;
            let dataLogin = 
            res.send(req.body);
        } catch(error) {
            res.send(error);
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

}

module.exports = Controller;