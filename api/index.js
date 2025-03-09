const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let currentLocation = null;

app.post('/location', (req, res) => {
  currentLocation = req.body;
  console.log('Received location:', currentLocation);
  res.sendStatus(200);
});

app.get('/location', (req, res) => {
  res.json(currentLocation);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
