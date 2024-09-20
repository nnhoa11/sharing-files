const mongoose = require('mongoose');
const uri = 'mongodb+srv://nnhoa2011:Nguyenhoa2011@prototype.bfp4d.mongodb.net/';
async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('connect successfuly');
    } catch (error) {
        console.log('Cannot connect', error);
    }
}

module.exports = { connect };
