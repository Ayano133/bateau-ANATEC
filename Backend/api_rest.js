const express = require("express");
const port = 3001;
const app = express();

app.get("/post", (req, res) => {
    res.json({ message: "Voici les données" });
});

app.listen(port, () => console.log(`Serveur a démarré au port` + port));

// Récupérer les coordonnées GPS de l'autre téléphone

