const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const userOwner = require('./user');

const storageSchema = new Schema({
    owner: {type: Types.ObjectId, ref: "User"},
    fileName: {type: String, required: true}
});

const Storage = model('Storage', storageSchema);
module.exports = Storage;