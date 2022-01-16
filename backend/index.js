const fs           = require('fs');
const express      = require('express');
const bodyParser   = require('body-parser');
const cors         = require("cors");
const { response } = require('express');
const spotify      = require('./routes/spotify');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port           = process.env.PORT || 4000;
const app            = express();
const spotifyRouter  = spotify();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:3000'}));
app.use('/spotify', spotifyRouter)

let csvData = [];
const readable = fs.createReadStream("../spotify_listtest.csv").setEncoding('utf8');
readable.on("data", (chunk) => {
  const lines = chunk.split(/\r?\n/);
  lines.pop(); // Last eol will create a null entry so strip
  const linesJson = lines.map((line) => {
    const fields = line.split(",");
    return (
      {
        rfid: fields[0],
        url:  fields[1],
        name: fields[2]
      }
    );
  });
  csvData = csvData.concat(linesJson);
});

app.get('/', (req, rsp) => {
  rsp.json(csvData);
  rsp.end();

});

app.get('/card/:rfid', (req, rsp) => {
  card = csvData.find((item) => item.rfid === req.params.rfid);
  rsp.json(card);
});

app.post('/card/:rfid', (req, rsp) => {
  csvData = csvData.map((card) => {
    if (card.rfid === req.params.rfid) {
      return(req.body)
    }
    else {
      return card;
    }
  });
  console.log(csvData);
  updateCSV(csvData);
  rsp.json(csvData);
});

const updateCSV = async (data) => {

};

app.listen(port, () => console.log(`Listening on port ${port}`));