const express = require('express');

const init = (getCSVData, setCSVData, updateCSV) => {
  const router = express.Router();

  router.get('/', (req, rsp) => {
    rsp.json(getCSVData());
  });

  router.get('/:rfid', (req, rsp) => {
    card = getCSVData().find((item) => item.rfid === req.params.rfid);
    rsp.json(card);
  });

  router.post('/:rfid', (req, rsp) => {
    const csvData = getCSVData();
    setCSVData(csvData.map((card) => {
      if (card.rfid === req.params.rfid) {
        return(req.body)
      }
      else {
        return card;
      }
    }));
    updateCSV(csvData);
    rsp.json(csvData);
  });

  return router;
}

module.exports = init;