const express = require('express'); 
const Router = express.Router();
const FilesController = require('../controllers/FilesController');
const multer  = require('multer')
const path = require('path')
// const upload = multer({ dest: 'uploads/' })
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
  
})
const upload = multer({ storage: storage })

Router.get('/files/get-all', FilesController.getFiles)
Router.post('/files/upload', upload.single('files'), FilesController.uploadFiles)
module.exports = Router;