const User = require('../models/user')
const Item = require('../models/storage')
const bcrypt = require('bcrypt')
const saltRound = 10;

class AuthUser {
    /**
     * Handles user login.
     *
     * @param {Object} req - The request object containing the username and password.
     * @param {Object} res - The response object to send back to the client.
     * @param {Function} next - The next middleware function in the stack.
     *
     * @returns {void}
     */
    login(req, res, next) {
        User.findOne({ username: req.body.username }).then(user => {
            
            if (user) {
                bcrypt.compare(req.body.password, user.password)
                .then((hash) => {
                    if (hash) {
                        console.log('success')
                        res.json({
                            success: true,
                            username: user.username,
                            userId: user._id,
                            type: "custom"
                        })
                    }
                    else {
                        console.log('wrong password')
                        res.json({ success: false, message: 'Authentication failed.' })
                    }
                })

            }
        })
        .catch(err => console.log('user not found'))
    }
    register(req, res, next) {
        User.findOne({ username: req.body.username})
        .then(user => {
            if (user){
                res.json({ success: false, message: 'Username already exists.' });
            }
            else {
                bcrypt.hash(req.body['password'], saltRound)
                .then((hash) => {
                    req.body.password = hash;
                    const newUser = new User(req.body)
                    newUser.save()
                   .then((user) => {
                      
                        res.json({
                            success: true,
                            username: user.username,
                            userId: user._id,
                        })
                   })
                })
            }
        })
        
    }
}
module.exports = new AuthUser