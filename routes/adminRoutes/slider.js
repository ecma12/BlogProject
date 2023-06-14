const express = require('express');

const routes = express.Router();

const Slider = require('../../models/Slider');

const sliderController = require('../../controllers/AdminController/sliderController');

routes.get('/add_slider',sliderController.sliderPage);

routes.post('/insertSliderRecord',Slider.uploadedAvatar, sliderController.insertSliderRecord );



module.exports = routes;