const express = require('express');

const routes = express.Router();

const Comment = require('../../models/Comment');

const userController = require('../../controllers/UserController/userController');

routes.get('/', userController.userHome);

routes.get('/blogSingle/:id', userController.BlogSingle);

routes.post("/setComments",Comment.uploadedAvatar, userController.setComments);

module.exports= routes;