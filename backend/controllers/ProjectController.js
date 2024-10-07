const User = require('../models/user');
const Project = require('../models/project');
const Files = require('../models/storage');
const axios = require('axios');
const Receipt = require('../models/receipt')
const fs = require('fs');
class ProjectController{
    createProject(req, res, next){
        User.findOne({_id: req.body.userId})
        .then(user => {
            if (user) {
                Project.create({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    owner: req.body.userId
                }).then(project => {
                    
                    User.findOneAndUpdate(
                        {
                            _id: user._id
                        }, 
                        {
                            projects: [...user.projects, project._id]
                        }
                    )
                    if (req.file){
                  
                        Files.create({
                            fileName: req.file.filename,
                            originName: req.file.originalname,
                            project: project._id
                        })
                        .then(files => {
                            const filter = {
                                _id: project._id
                            }
                            const update = {
                                files: files._id
                            }
                            Project.findOneAndUpdate(filter, update)

                            res.json({ success: true, project: project });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                    }
                    

                })
                .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
    }
    getAllProjects(req, res){
        Project.find()
        .then(project => {
            res.json({ success: true, projects: project });
        })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err.message })
        })
    }

    getProjectById(req, res){
        Project.findById(req.query.id)
       .then(project => {
            if (project)
                res.json({ success: true, project: project }); 
            else
                res.json({ success: false, message: "Project not found"})
       })
       .catch(err => {
           console.log(err);
           res.json({ success: false, message: err.message })
       })
    }

    async purchaseProject(req, res){
        const accessToken = async () => {
            let accessToken = ''
            await axios({
                url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
                method: 'post',
                data: 'grant_type=client_credentials',
                auth: {
                    username: 'AQ2NqszK3nzYME18y-qk7IL14WLN6vLlAd2z-omDQwprfFvcNHLqmoDKIM-wX9wVe8783UyOsDGhrSh5',
                    password: 'EPocZ5gMq2fbaIljk72GfkDfYccW_r1XNPxtRWHGJVRiT72h1agQ2BYdJj-Za7sY9VDHWTNeN17lreW7'
                }
            })
            .then(token =>  accessToken = token.data.access_token);
            
            return accessToken;
        }
        const token = await accessToken();
        Project.findById(req.body.projectId)
        .then(project => {
            if (!project) return res.json({ success: false, message: "project not found"});
            axios.post("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
                "purchase_units": [
                    {
                    "amount": {
                        "currency_code": "USD",
                        "value": "100.00"
                    },
                        "items": [
                            
                        ]
                    }
                ],
                "intent": "CAPTURE",
                "payment_source": {
                    "paypal": {
                    "experience_context": {
                        "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
                        "payment_method_selected": "PAYPAL",
                        "brand_name": "EXAMPLE INC",
                        "locale": "en-US",
                        "landing_page": "LOGIN",
                        "shipping_preference": "GET_FROM_FILE",
                        "user_action": "PAY_NOW",
                        "return_url": "http://localhost:3001",
                        "cancel_url": "http://localhost:3001"
                    }
                    }
                },
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    },
            })
            // .then((response) => response.json())
            .then(receipt => {
                // console.log(receipt.data)
                res.json(receipt.data)
            })
            .catch((error) => console.log(error));
        })
    }
    async paymentApprovers(req, res) {
        const accessToken = async () => {
            let accessToken = ''
            await axios({
                url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
                method: 'post',
                data: 'grant_type=client_credentials',
                auth: {
                    username: 'AQ2NqszK3nzYME18y-qk7IL14WLN6vLlAd2z-omDQwprfFvcNHLqmoDKIM-wX9wVe8783UyOsDGhrSh5',
                    password: 'EPocZ5gMq2fbaIljk72GfkDfYccW_r1XNPxtRWHGJVRiT72h1agQ2BYdJj-Za7sY9VDHWTNeN17lreW7'
                }
            })
            .then(token =>  accessToken = token.data.access_token);
            
            return accessToken;
        }
        const token = await accessToken();
        const clientId = req.query.clientId;
        const projectId = req.query.projectId;
        if (!req.query.id)
            res.json({ success: false, message: "Please provide payment details"})
        const id = req.query.id;
        console.log(req.query);
        axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${id}/capture`, 
            {},{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    },
            }
        )
        .then(response => {
            if (response.data.status === "COMPLETED")
               User.findById(clientId).then(user => {
                    if (user){
                        Receipt.create({
                            clientId : clientId,
                            projectId : projectId,
                            })
                            .then(receipt => {

                                 User.findOneAndUpdate(
                                    {
                                        _id: user._id
                                    }, 
                                    {
                                        receipts: [...user.receipts, receipt._id]
                                    }
                                )
                      
                            })
                            .catch(err => console.log(err))
                    }
                    else {
                        res.json({ success: false, message: "User not found"})
                    }
                })
               
            res.json(response.data)
        })
        .catch((error) => {
            console.log(error)
            res.json({success: false, message: error.response.data})
        });

    }

    downloadFile(req, res) {
        const {clientId, projectId} = req.query;
        if (!clientId || !projectId)
            res.json({success: false, message: "Please provide receipt details"})
        
        Receipt.findOne({clientId, projectId}).findOne({
            clientId: clientId,
            projectId: projectId
        })
        .then(receipt => {
            if (receipt) {
                Project.findById(receipt.projectId).then(project => {
                    if (!project) res.json({success: false, message: "Project not found"})
                    console.log(project)
                    Files.findById(project.files).then(file => {
                        if (file) {
                            res.download(`./uploads/${file.fileName}`, file.originName)
                        }
                        else res.json({success: false, message: "File not found"})
                    })
                    .catch(error => res.json({success: false, message: error.message}))
                       
                })
                .catch(err => res.json({ success: false, message: err.message }))
            }
            else {
                res.json({success: false, message: "Receipt not found"})
            }
        })
        .catch(err => {
            console.log(err)
            res.json({ success: false, message: err.message })
        })
    }
   
}
module.exports = new ProjectController