const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

const readFileData = util.promisify(fs.readFile);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFileData('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
  





app.listen(PORT, () => {
    console.log('Server listening on port 3001');
})