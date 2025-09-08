const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: String,
    item: String,
    place: String,
    available: {
        type: String,
        default: "yes"
    },
    claimerid:{
        type:String,
        default:"0000"
    }

});

module.exports = mongoose.model("products", userSchema);
