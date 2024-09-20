const express = require('express'); 
const Router = express.Router();
const AuthUserController = require('../controllers/AuthUserController');

Router.post('/login', AuthUserController.login)
Router.post('/register', AuthUserController.register)
module.exports = Router;