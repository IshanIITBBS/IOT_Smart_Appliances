const express = require('express');
const router = express.Router();
const fancontroller = require('../controller/fan.js');
const lightcontroller = require('../controller/light.js') ;
const maincontroller = require('../controller/main.js')
router.get('/Fan/On', fancontroller.turnOnFan) ;
router.get('/Fan/Off', fancontroller.turnOffFan) ;

router.get('/Light/On',lightcontroller.turnOnLight) ;
router.get('/Light/Off',lightcontroller.turnOffLight) ;
router.post('/Fan/speed', fancontroller.Fanspeed) ;
router.get('/states', maincontroller.Sendstates) ;
router.post('/mode',maincontroller.Setmode)
module.exports = router ;



