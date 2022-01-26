const fs           = require('fs');
const express      = require('express');
const bodyParser   = require('body-parser');
const cors         = require("cors");
const { response } = require('express');
const spotify      = require('./routes/spotify');
const card         = require('./routes/card');
const next         = require('next');

const dev          = process.env.NODE_ENV !== 'production';
const nextApp      = next({dev});
const handle       = nextApp.getRequestHandler();


if (dev) {
  require('dotenv').config();
}

const port           = process.env.PORT || 4000;
const app            = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:3000'}));

let csvData = [];
const readable = fs.createReadStream("../../spotify_listtest.csv").setEncoding('utf8');
readable.on("data", (chunk) => {
  const lines = chunk.split(/\r?\n/);
  lines.pop(); // Last eol will create a null entry so strip
  const linesJson = lines.map((line) => {
    const fields = line.split(",");
    return (
      {
        rfid: fields[0],
        uri:  fields[1],
        name: fields[2]
      }
    );
  });
  csvData    = csvData.concat(linesJson);
});

const updateCSV = async (data) => {
    const writeable = await fs.createWriteStream("../../spotify_listtest.csv");
  csvData.forEach(async (card) =>  {
    await writeable.write(`${card.rfid},${card.uri},${card.name.replace(/\s/g,'').toLowerCase()}\n\r`);
  });
};

const setCSVData = (data) => {
  csvData = data;
};

const getCSVData = () => {
  return csvData;
};

nextApp.prepare().then(() => {
  const cardRouter     = card(getCSVData, setCSVData, updateCSV);
  const spotifyRouter  = spotify();
  app.use('/spotify', spotifyRouter)
  app.use('/card', cardRouter);
  app.all('*', (req, res) => {
    return handle(req, res);
  })
  
  app.listen(port, () => console.log(`Listening on port ${port}`));
}).catch((err) => console.error(err));