const express = require('express');
const Controller = require('../controllers/controller');
const app = express();
const router = express.Router();

router.get('/', Controller.landingPage);
router.get('/login', Controller.renderLogin);
router.post('/login', Controller.handlerLogin);

router.get('/signup', Controller.renderSignup);
router.post('/signup', Controller.handlerSignup);


const isLoggedIn = function (req, res, next){
    if(!req.session.userId){
        const error = 'Please login first';
        res.redirect(`/login?error=${error}`);
    } else {
        next();
    }
}

const isDoctor = function (req, res, next){
    if(!req.session.userId || req.session.role !== 'doctor'){
        const error = `You dont have permission in doctor page`;
        res.redirect(`/doctor?error=${error}`); 
    } else {
        next();
    }
}

const isPatient = function (req, res, next){
    if(!req.session.userId || req.session.role !== 'patient'){
        const error = `You dont have permission in patient page`;
        res.redirect(`/patient?error=${error}`); 
    } else {
        next();
    }
}
router.get('/doctor/:idUser/edit', Controller.renderEditDoctor);
router.post('/doctor/:idUser/edit', Controller.handlerEditDoctor);

router.get('/patient/:idUser/edit', Controller.renderEditPatient);
router.post('/patient/:idUser/edit', Controller.handlerEditPatient);

router.get('/doctor', isLoggedIn, isDoctor, Controller.homeDoctor);
router.get('/doctor/showpatients', isLoggedIn, isDoctor, Controller.showPatients);
// router.get('/doctor/:id/action', Controller.renderActionDoctor);
// router.post('/doctor/:id/action', Controller.handlerActionDoctor);
// router.get('/doctor/:id/receipt', Controller.renderReceiptDoctor);
// router.post('/doctor/:id/receiptd', Controller.handlerReceiptDoctor);

router.get('/patient', isLoggedIn, isPatient, Controller.homePatient);
router.get('/patient/showdoctors', isLoggedIn, isPatient, Controller.showDoctors);
router.get('/patient/:id/consultation', isLoggedIn, isPatient, Controller.renderConsultation);
router.post('/patient/:id/consultation',isLoggedIn, isPatient, Controller.handlerConsultation);
// router.get('/patient/showreceipt', Controller.showReceipt);

router.get('/logout', function (req, res, next) {
    // logout logic
  
    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.userId = null
    req.session.role = null
    req.session.save(function (err) {
      if (err) next(err)
  
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err) {
        if (err) next(err)
        res.redirect('/')
      })
    })
  })

module.exports = router;