const express = require('express');
const Controller = require('../controllers/controller');
const app = express();
const router = express.Router();

router.get('/', Controller.tes);
router.get('/login', Controller.renderLogin);
router.post('/login', Controller.handlerLogin);

router.get('/signup', Controller.renderSignup);
router.post('/signup', Controller.handlerSignup);

// router.get('/doctor/edit', Controller.renderEditDoctor);
// router.post('/doctor/edit', Controller.handlerEditDoctor);

// router.get('/patient/edit', Controller.renderEditPatient);
// router.post('/patient/edit', Controller.handlerEditPatient);

// router.get('/doctor', Controller.homeDoctor);
// router.get('/doctor/showpatients', Controller.showPatients);
// router.get('/doctor/:id/action', Controller.renderActionDoctor);
// router.post('/doctor/:id/action', Controller.handlerActionDoctor);
// router.get('/doctor/:id/receipt', Controller.renderReceiptDoctor);
// router.post('/doctor/:id/receiptd', Controller.handlerReceiptDoctor);

// router.get('/patient', Controller.homePatient);
// router.get('/patient/showdoctors', Controller.showDoctors);
// router.get('/patient/:id/consultation', Controller.renderConsultation);
// router.post('/patient/:id/consultation', Controller.handlerConsultation);
// router.get('/patient/showreceipt', Controller.showReceipt);

module.exports = router;