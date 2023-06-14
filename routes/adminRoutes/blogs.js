const express = require('express');

const routes = express.Router();

const blog = require('../../models/Blog');

const blogController = require('../../controllers/AdminController/blogController');

routes.get('/add_blog', blogController.add_blog);

routes.post('/insertBlogRecord',blog.uploadedAvatar,blogController.insertBlogrecord);

routes.get('/view_comments', blogController.viewComments);
module.exports = routes;