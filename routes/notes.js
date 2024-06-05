const express = require('express');
const fetchuser = require('../middleware/fetchuser')
const router = express.Router();
const Notes = require('../models/Notes');
const { check, validationResult } = require('express-validator');

//Get all the notes through get api : login required
router.get('/fetchallnotes' ,fetchuser,  async(req, resp) => {
    const notes = await Notes.find({user: req.user.id});
    resp.json(notes);


})


//save notes through post api: login required
router.post('/addnote', fetchuser,[
    
    check('title', 'enter a valid title').isLength({min : 3}),
    check('description', 'description should be atleast 5 characters').isLength({min: 5})

] , async(req, resp) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return resp.status(400).json({errors: errors.array()});
    }

    const {title, description, tag } = req.body;
    const note = new Notes({"title" : title, "description" : description, "tag" : tag, user: req.user.id});
    const savedNote = await note.save();

    resp.json(savedNote);

})


//update notes through put api: login required
router.put('/updatenote/:id', fetchuser , async(req, resp) => {
    const {title, description, tag} = req.body;
    const newNote = {};
    if(title){
        newNote.title = title;
    }
    if(description){
        newNote.description = description;
    }
    if(tag){
        newNote.tag = tag;
    }

    let note = await Notes.findById(req.params.id);
    if(!note){
        return resp.status(404).send("Not Found");
    }

    if(note.user.toString() !== req.user.id){
        return resp.status(401).send("not allowed");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
    resp.json(note);

    
})



router.delete('/deletenote/:id', fetchuser , async(req, resp) => {
   

    let note = await Notes.findById(req.params.id);
    if(!note){
        return resp.status(404).send("Not Found");
    }

    if(note.user.toString() !== req.user.id){
        return resp.status(401).send("not allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    resp.json({"success" : " note has been deleted"});

    
})


module.exports = router;