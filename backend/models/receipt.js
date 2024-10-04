const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose

const ReceiptSchema = new Schema({
    clientId : {type: Types.ObjectId, required: true, ref: 'User'},
    projectId : {type: Types.ObjectId, required: true},
})

const Receipt = model('Receipt', ReceiptSchema)
module.exports = Receipt;