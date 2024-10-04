const mongoose = require('mongoose');
const { Schema, Types, model} = mongoose;
const File = require('./storage')

const ProjectSchema = new Schema({
    name : {type: String, required: true},
    description : {type: String, required: false},
    price: {type: Number, required: true},
    owner: {type: Types.ObjectId, required: true, ref: 'User'},
    files: {type: Types.ObjectId, ref: "File"},
})
const Project = model('Project', ProjectSchema)
module.exports = Project;