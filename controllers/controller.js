const {Consultation, Doctor, MedicalRecord, Patient, Receipt, Specialist, User} = require('../models/index');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');
const { categoryBMI } = require('../helper');

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
            let {error} = req.query;
            res.render('signup', {error});
        } catch (error) {
            res.send(error);
        }
    }
    static async handlerSignup(req, res){
        try {
            // res.send(req.body);
            let {username, password, role} = req.body;
            // let checkUsername = await User.findAll({
            //     where : {
            //         username : username
            //     }
            // })
            // // console.log(checkUsername.length);
            // // if(checkUsername.length !== 0){
            // //     throw {usernameValidation: 'Username already exists'};
            // // }
            await User.create({
                username, password, role, createdAt : new Date, updatedAt : new Date 
            })
            let data = await User.findAll();
            console.log(data[data.length-1].id, '<---');
            req.session.userId = data[data.length-1].id;
            req.session.role = data[data.length - 1].role;
            if(role === 'patient'){
                res.redirect(`/patient/${data[data.length-1].id}/edit`);
            } else if (role === 'doctor'){
                res.redirect(`/doctor/${data[data.length-1].id}/edit`);
            }
        } catch (error) {
            if(error.name === 'SequelizeValidationError'){
                let err = error.errors.map(el => el.message);
                res.redirect(`/signup?error=${err}`);
            } else {
                res.send(error);
            }
            console.log(error);
        }
    }

    //doctor
    static async homeDoctor(req, res){
        try {
            let {error} = req.query;
            let {done} =req.body;
            // let isDone = done.split('+');
            // console.log(isDone);
            let id = req.session.userId;
            let data = await User.findByPk(id, {include: Doctor});
            let dataDoctor = await Doctor.findByPk(data.Doctor.id, {include: Specialist});
            let dataConsultations = await Consultation.findAll({
                where: {
                    doctorId : data.Doctor.id
                }
            }) 
            console.log(dataConsultations);
            // let consultations = await Consultation.findAll({
            //     where : {
            //         doctorId : data.Doctor.id
            //     }
            // });
            console.log(data, '<--`');
            // console.log(findSpecialist, '-----');
            console.log(error);
            res.render('home-doctor',{data, dataDoctor, dataConsultations});
        } catch (error) {
            res.send(error);
        }
    }
    static async renderEditDoctor(req, res){
        try {
            let {error} = req.query;
            let id = +req.params.idUser;
            let data = await Specialist.findAll();
            res.render('editdoctor',{data, id, error});
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
    static async handlerEditDoctor(req, res){
        try {
            let id = +req.params.idUser;
            console.log(id, '<---');
            let {name, image, education, specialist, weight, height, DoB, gender} = req.body;
            await Doctor.create({name, image, education, specialistId : specialist, weight, height, DoB, gender, userId : id});
            res.redirect('/doctor');
        } catch (error) {
            let id = +req.params.idUser;
            if(error.name === 'SequelizeValidationError'){
                let err = error.errors.map(el => el.message);
                res.redirect(`/doctor/${id}/edit?error=${err}`);
            } else {
                res.send(error);
            }
            console.log(error);
        }
    }
    static async showPatients(req, res){
        try {
            let {search} = req.query;
            let opt = {};
            if(search){
                opt= {
                    where : {
                        name: {
                            [Op.iLike] : `%${search}%`
                        }
                    }
                }
            }
            let patients = await Patient.findAll(opt);
            console.log(patients);
            res.render('patient-list',{patients, categoryBMI});
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    //patient
    static async homePatient(req, res){
        try {
            let {error, action} = req.query;
            let id  = req.session.userId;
            console.log(id, '---> id');
            let data = await User.findByPk(id, {include: Patient});
            let dataConsultations = await Consultation.findAll({
                where: {
                    patientId : data.Patient.id
                }
            }) 
            // console.log(error);
            // console.log(data);
            // res.send(data.Patient);
            console.log(data.Patient.id);
            console.log(dataConsultations);
            res.render('home-patient',{data, categoryBMI, action, dataConsultations});
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }
    static async showDoctors(req, res){
        try {
            let {category} = req.query;
            let opt = {};
            console.log(category);
            // if(category === 'all'){
            //     category="";
            // }
            if(category){
                opt= {
                    where : {
                        specialistId: category
                    }
                }
            }
            console.log(opt);
            let doctors = await Doctor.findAll( opt);
            console.log(doctors);
            // res.send(doctors)
            res.render('doctor-list',{doctors})
        } catch (error) {
            res.send(error);
        }
    }
    static async renderConsultation(req, res){
        try {
            let id = +req.params.id;
            let doctor = await Doctor.findByPk(id, {include: Specialist});
            res.render('patient-consultation', {doctor});
        } catch (error) {
            res.send(error);
        }
    }
    static async handlerConsultation(req, res){
        try {
            let userId = req.session.userId;
            let doctorId = +req.params.id;
            let users = await User.findByPk(userId, {include: Patient});
            let {complaint, images} = req.body;
            await Consultation.create({complaint, images, patientId: users.Patient.id, doctorId, isDone: false});
            res.redirect('/patient?action=Your Complaint has been recorded');
        } catch (error) {
            res.send(error);
        }
    }
    static async renderEditPatient(req, res){
        try {
            let {error} = req.query;
            let id = +req.params.idUser;
            res.render('editpatient',{id, error});
        } catch (error) {
            res.send(error);
        }
    }
    static async handlerEditPatient(req, res){
        try {
            let id = +req.params.idUser;
            console.log(id, '<---');
            let {name, image, education, weight, height, DoB, gender} = req.body;
            await Patient.create({name, image, education, weight, height, DoB, gender, userId : id});
            res.redirect('/patient');
        } catch (error) {
            let id = +req.params.idUser;
            if(error.name === 'SequelizeValidationError'){
                let err = error.errors.map(el => el.message);
                res.redirect(`/patient/${id}/edit?error=${err}`);
            } else {
                res.send(error);
            }
            console.log(error);
        }
    }

}

module.exports = Controller;