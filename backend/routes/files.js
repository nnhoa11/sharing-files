const express = require('express'); 
const Router = express.Router();
const FilesController = require('../controllers/FilesController');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

Router.get('/files/get-all', FilesController.getFiles)
Router.post('/files/upload', upload.array('files'), FilesController.uploadFiles)
module.exports = Router;