const express = require('express');
const Router = express.Router();
const ProjectController = require('../controllers/ProjectController')
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
Router.post('/project/create', upload.single('files'), ProjectController.createProject)
Router.get('/project/get-all', ProjectController.getAllProjects)
Router.get('/project/get-by-id', ProjectController.getProjectById)
Router.post('/project/paypal/create-order', ProjectController.purchaseProject)
Router.get('/project/paypal/payment-approvers', ProjectController.paymentApprovers)
Router.get('/project/download', ProjectController.downloadFile)
module.exports = Router;