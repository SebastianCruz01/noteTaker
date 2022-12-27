//============================================= Dependencies =======================================
const PORT = process.env.PORT || 3001;                                       //port
const fs = require('fs');                                                    //file system module
const path = require('path');                                                //path module

const express = require('express');                                          //express module
const app = express();                                                       //server



const allNotes = require('./db/db.json');                                    //array of all notes

//=============================================== Middleware =======================================
// parse incoming string or array data
// parse incoming JSON data
// make files in public folder available

app.use(express.urlencoded({ extended: true }));                          //middleware
app.use(express.json());                                                  //middleware
app.use(express.static('public'));                                        //middleware

//=============================================== Routes =======================================
app.get('/api/notes', (req, res) => {                                     //GET request
    res.json(allNotes.slice(1));                                        //sends all notes
});


app.get('/', (req, res) => {                                         //GET request
    res.sendFile(path.join(__dirname, './public/index.html'));       //sends index.html
});

app.get('/notes', (req, res) => {                                    //GET request
    res.sendFile(path.join(__dirname, './public/notes.html'));       //sends notes.html
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));      //sends index.html
});

// ==========================================Path: server.js=========================================

function createNewNote(body, notesArray) {                          //function to create a new note
    const newNote = body;                                           //new note
    if (!Array.isArray(notesArray))                                 //if notesArray is not an array
        notesArray = [];
    
    if (notesArray.length === 0)                                 // if notesArray is empty
        notesArray.push(0);                                      // add 0 to notesArray

    body.id = notesArray[0];                                     //assign id to new note
    notesArray[0]++;                                             //increment id

    notesArray.push(newNote);                                   //add new note to notesArray
    fs.writeFileSync(                                           //write to db.json
        path.join(__dirname, './db/db.json'),                   //path to db.json
        JSON.stringify(notesArray, null, 2)                     //stringify notesArray
    ); 
    return newNote;                                             //return new note
}

app.post('/api/notes', (req, res) => {                         //POST request
    const newNote = createNewNote(req.body, allNotes);         //create new note
    res.json(newNote);                                         //send new note back to client
});

//  Function to delete a note
//  @param {string} id - id of note to delete
//  @param {Array} notesArray - array of note objects
//  @returns {void}
//  @example

function deleteNote(id, notesArray) {                  //function to delete a note
    for (let i = 0; i < notesArray.length; i++) {      //loop through notesArray
        let note = notesArray[i];                      //assign note to notesArray[i]

        if (note.id == id) {                           //if note.id is equal to id
            notesArray.splice(i, 1);                   //remove note from notesArray
            fs.writeFileSync(                          //write to db.json
                path.join(__dirname, './db/db.json'),  //path to db.json
                JSON.stringify(notesArray, null, 2)    //stringify notesArray
            );
            break;                                     //break out of loop
        }   
    }   
}   


app.delete('/api/notes/:id', (req, res) => {           //DELETE request
    deleteNote(req.params.id, allNotes);               //delete note
    res.json(true);                                    //send true back to client
});


app.listen(PORT, () => {                               //server listens on port
    console.log(`API server now on port ${PORT}!`);    //console log
});

