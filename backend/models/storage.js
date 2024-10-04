const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const Project = require('./project');

const storageSchema = new Schema({
    project: {type: Types.ObjectId, ref: "Project"},
    fileName: {type: String, required: true},
    originName: {type: String, required: true},
});

const Storage = model('Storage', storageSchema);
module.exports = Storage;