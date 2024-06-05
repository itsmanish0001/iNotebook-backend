const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    description:{
        type: String,
        required: true,
    },

    tag:{
        type: String,
        default: "general"
    },

    date:{
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('notes', NotesSchema);