const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    id: String,
    password: String
});

module.exports = mongoose.model("signup", userSchema); 

