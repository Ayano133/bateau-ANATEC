const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3001;
const app = express();

app.use(cors());
app.use(bodyParser.json());

let otherPhoneLocation = null;
let markerLocation = null; // Ajout de la variable pour stocker la position du marker

app.get("/post", (req, res) => {
  res.json({ message: "Voici les données" });
});

// Endpoint pour recevoir la position du marker
app.post("/set-location", (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude && longitude) {
    markerLocation = { latitude, longitude };
    console.log("Localisation du marker reçue:", markerLocation);
    res.status(200).json({ message: "Localisation du marker reçue avec succès" });
  } else {
    res.status(400).json({ error: "Latitude et longitude sont requises" });
  }
});

// Endpoint pour envoyer la position du marker
app.get("/marker-location", (req, res) => {
  if (markerLocation) {
    res.status(200).json(markerLocation);
  } else {
    res.status(404).json({ message: "Localisation du marker introuvable" });
  }
});

app.post("/location", (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude && longitude) {
    otherPhoneLocation = { latitude, longitude };
    console.log("Localisation reçue de l'autre téléphone:", otherPhoneLocation);
    res.status(200).json({ message: "Localisation reçue avec succès" });
  } else {
    res.status(400).json({ error: "Latitude et longitude sont requises" });
  }
});

app.get("/location", (req, res) => {
  if (otherPhoneLocation) {
    res.status(200).json(otherPhoneLocation);
  } else {
    res.status(404).json({ message: "Localisation introuvable" });
  }
});

app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));







// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors"); // Importez le middleware CORS
// const port = 3001;
// const app = express();

// app.use(cors()); // Utilisez CORS pour autoriser les requêtes depuis n'importe quelle origine (à des fins de développement)
// app.use(bodyParser.json());

// let otherPhoneLocation = null;

// app.get("/post", (req, res) => {
//   res.json({ message: "Voici les données" });
// });

// app.post("/location", (req, res) => {
//   const { latitude, longitude } = req.body;

//   if (latitude && longitude) {
//     otherPhoneLocation = { latitude, longitude };
//     console.log("Localisation reçue de l'autre téléphone:", otherPhoneLocation);
//     res.status(200).json({ message: "Localisation reçue avec succès" });
//   } else {
//     res.status(400).json({ error: "Latitude et longitude sont requises" });
//   }
// });

// app.get("/location", (req, res) => {
//   if (otherPhoneLocation) {
//     res.status(200).json(otherPhoneLocation);
//   } else {
//     res.status(404).json({ message: "Localisation introuvable" });
//   }
// });

// app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));

// const express = require("express");
// const port = 3001;
// const app = express();

// app.get("/post", (req, res) => {
//     res.json({ message: "Voici les données" });
// });

// app.listen(port, () => console.log(`Serveur a démarré au port` + port));

// Récupérer les coordonnées GPS de l'autre téléphone

