const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    projects: [{type: Schema.Types.ObjectId, ref: 'Project'}],
    receipts: [{type: Schema.Types.ObjectId, ref: 'Receipt'}]  // Should be able to receive payments from clients
})

const User = model('User', userSchema)
module.exports = User;