// all dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
// uuid is a random id generator that is used for the note id
const { v4: myUuidv4 } = require('uuid');
const util = require('util');

const app = express();
// this allows for heroku to decide the port
const PORT = process.env.PORT || 3001;

// middleware and declaring the public files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));

// helper function to read data from db.json
const readFileData = util.promisify(fs.readFile);

// route to get the index.html file when the homepage loads
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// route to send the user to the notes page when the 'getting started' button is clicked
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

// route that reads db.json and returns all the saved notes for the user to see
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFileData('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// route that takes user inputted note and adds it to the existing notes
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    const {title, text} = req.body;
    // generates random id for note
    const id = myUuidv4();
    readFileData('./db/db.json')
    // takes existing notes and adds new note to end of array
      .then((data) => JSON.parse(data))
      .then((notes) => {
        notes.push({title, text, id});
        // rewrites the file with the existing and newly added note
        fs.writeFile('./db/db.json', notes, (err) => {
            console.log(notes);
          if (err) throw err;
        //   sends success message to client
          res.json({success: true});
        });
      })
    //   if there is an error, send error to client
      .catch((err) => {
        console.error(err);
        res.json({ success:false});
      });
  });

//   catch all that returns user to homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// instructs server to listen on designated port
app.listen(PORT, () => {
    console.log('Server listening on port 3001');
})