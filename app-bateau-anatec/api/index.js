import express, { json } from 'express';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(cors({
  origin: '*', // À MODIFIER en production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(json());

let currentLocation = null;

app.post('/location', (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).send('Latitude et longitude doivent être des nombres');
    }

    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).send("Latitude and longitude must be valid numbers");
    }

    currentLocation = {
      latitude,
      longitude,
      timestamp: new Date(),
    };
    console.log('Received location:', currentLocation);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing location:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

app.get('/location', (req, res) => {
  if (currentLocation) {
    res.json(currentLocation);
  } else {
    res.status(404).send('Aucune position disponible');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});








// const express = require('express');
// const cors = require('cors');
// const app = express();
// const port = 3001;

// app.use(cors({
//   origin: '*', // Allow all origins
//   methods: ['GET', 'POST', 'OPTIONS'], // Allow these methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
// }));
// app.use(express.json());

// let currentLocation = null;

// app.post('/location', (req, res) => {
//   currentLocation = req.body;
//   console.log('Received location:', currentLocation);
//   res.sendStatus(200);
// });

// app.get('/location', (req, res) => {
//   res.json(currentLocation);
// });

// app.listen(port, () => {
//   console.log(`Server listening at 10.24.22.191`);
// });



