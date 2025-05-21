# Les installations prérequis !!!

## Expo:
### Installation
```typescript
npx create-expo-app@latest
```



## Binome :

- PEREIRA DA SILVA RODRIGUES Mattéo (Github : Ayano133)
- RENTE--PINTO Lucas (Github : hazel58)


# <ins>Compte rendu:</ins>
### Présentation du projet:

Le bateau Anatec est un bateau amorceur. Créé pour aider les pécheurs en lâchant des appâts à des endroits précis dans l’eau.
Le bateau contient deux bacs a appâts de 400 ml chacun. Ses deux moteurs lui permettent de se déplacer aux coordonnées indiquées
et son GPS permet à l’utilisateur de localiser le bateau et permet à celui-ci de se repérer par rapport aux zones choisies.
L’application permet de choisir des zones afin que le bateau se déplace vers celles-ci. Elle permet aussi d'indiquer au bateau
quand lacher les appâts.

### L'application :

En ouvrant l’application, l’utilisateur se trouve face à une carte, sur la carte se trouve deux markers ; un pour l’appareil
de l’utilisateur et un autre pour le bateau. Chacun fonctionne en temps réel. A gauche, se trouve trois boutons, le
premier sert à recentrer la carte sur la position de l’utilisateur, le second bouton permet de largage des appâts et le dernier
bouton supprime toutes les positions choisies. Les positions, elles, sont limitées à deux. Elles sont placées en cliquant sur la
carte et peuvent êtres sélectionnées afin de les supprimer individuellement ou d’indiquer au bateau d’aller à ces coordonnées. 

### Fonctionnement de l'application:

L’application est développée sur le logiciel Visual Studio Code en utilisant ReactNative avec Expo comme langage
de programmation. Un serveur Node créé avec le langage JavaScript depuis un ordinateur qui relie le système et l’appareil
de l’utilisateur.

L’application est découpée en deux parties : une partie sur l’appareil utilisateur qui reçoit les coordonnées                                                                                                                    &
et qui permet d’envoyer un ordre pour lâcher les appâts. Une seconde partie qui envoie ses coordonnées grâce à un GPS et qui
reçoit l’ordre de lâcher les appâts.


### Difficultés rencontrées:
+ Envoi et réception de données sur le serveur
+ Fonctionnement du bouton pour recentrer la carte sur l’utilisateur
+ Demande de permissions entre les systèmes (permission d’accéder aux données gps)
+ Récupération des données gps des zones sélectionnées.
+ envoie de <ins>nouvelles</ins> coordonnées uniquement. (si changement de position)

### Tests réalisés:

Par manque de matériel (GPS), les tests ont été réalisés entre deux téléphones, un dans le rôle de l’appareil utilisateur et
l’autre dans le rôle du bateau. Le but était de voir si les données étaient bien transférées de l’un à l’autre en passant
par le serveur.


|  Les différents tests sont:                                      | Résultats:                                 |
| ---------------------------------------------------------------- | ------------------------------------------ |
| • La connexion entre le système et l'appareil utilisateur.       | • fonctionnel                              |
| • la distance maximale de connexion entre les deux appareils.    | • entre 30 et 50 mètres.                   |
| • la précision des positions du bateau.                          | • précis à environ 10 mètres.              |
| • l'envoi d'une notification pour annoncer le largage d'appâts.  | • fonctionnel.                             |
| • le fonctionnement de chaque bouton.                            | • fonctionnel.                             |
| • les demandes de permission d'accéder aux coordonnées.          | • fonctionnel.                             |

# Quelques exemples:

## Boutons:

``` typescript 

  <TouchableOpacity style={styles.button_centrer} onPress={() => {
          if (location?.coords) {
            // Vérifie si mapRef.current est défini avant d'appeler animateToRegion
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              }, 3000);
            } else {
              console.warn('mapRef.current is null');
            }
          } else {
            console.warn('location or location.coords is undefined');
          }
        }}>
          <Image source={require('@/images/Maps-Center-Direction-icon.png')} style={{ width: 35, height: 35,}} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button_appats} onPress={AirdropAppat} >
          <Image source={require('@/images/fish.png')} style={{ width: 35, height: 35,}} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button_remove_all_markers} onPress={handleRemoveAllMarkers} >
          <Image source={require('@/images/markers sup.png')} style={{ width: 35, height: 35,}} />
        </TouchableOpacity>

```
![Les boutons](https://github.com/user-attachments/assets/975dab08-5d41-42db-b08a-570c43c67693)

## Marquers et localisation de l'utilisateur:

``` typescript

            <Marker
              coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
              title="Utilisateur"
              description="HOME"
              pinColor='blue'
            />
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                title={`Position ${index + 1}`}
                onPress={() => handleMarkerPress(marker)}
              />
            ))}
            {otherPhoneLocation && (
              <Marker
                coordinate={{ latitude: otherPhoneLocation.latitude, longitude: otherPhoneLocation.longitude }}
                title="Lucas"
                pinColor="green"
                description={`Latitude: ${otherPhoneLocation.latitude}, Longitude: ${otherPhoneLocation.longitude}`}
              />

```

![Markers et localistion](https://github.com/user-attachments/assets/00d524ed-2697-4685-90b7-0e5a5bc36cf9)

## Interaction marquers:

```typescript

        {selectedMarker && (
          <View style={styles.rectangle}>
            <View style={styles.rectangle_head}>
              <Text style={styles.head_titre}>{selectedMarker.title}</Text>
              <TouchableOpacity style={styles.button_fermer} onPress={handleRemoveRectangle}>
                <Text style={styles.button_fermer_texte}>Fermer</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rectangle_gps}>
              <Text style={styles.text_titre_gps}>Latitude:</Text>
              <Text style={styles.coordonnées}>{selectedMarker.latitude}</Text>
              <Text style={styles.text_titre_gps}>Longitude:</Text>
              <Text style={styles.coordonnées}>{selectedMarker.longitude}</Text>
            </View>

            <View style={styles.rectangle_button}>
              <TouchableOpacity style={styles.button_sup} onPress={handleRemoveMarker}>
                <Text style={styles.button_sup_texte}>Supprimer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button_ALLER} onPress={handleGoToPosition}>
                <Text style={styles.button_ALLER_texte}>Aller à la position</Text>
              </TouchableOpacity>

            </View>
          </View>
        )}

```

![Interaction marker](https://github.com/user-attachments/assets/2e17c7c9-37d2-409a-8152-bfa0dcff5a13)



## Le serveur:

### Dossier du serveur:

```typescript
cd /Users/matteo/Desktop/bateau-ANATEC/backend
```

### Commande de lancement du serveur:

```typesrcipt
npm start
```
### Structure du serveur:

```typescript

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

app.post("/airdrop-appat", (req, res) => {
  const { message } = req.body;

  if (message === 'Lache les appats') {
    console.log("Message reçu: Lache les appats");
    appatMessage = message;
    // Gérer l'action de "Lache les appats" ici, par exemple, envoyer une notification à l'autre téléphone
    res.status(200).json({ message: "Message 'Lache les appats' reçu avec succès" });
  } else {
    res.status(400).json({ error: "Message incorrect" });
  }
});

app.get("/airdrop-appat", (req, res) => {
  if (appatMessage) {
    res.status(200).json({ message: appatMessage });
    appatMessage = null; // Clear the message after sending it
  } else {
    res.status(404).json({ message: "Aucun message d'appât disponible" });
  }
});

app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));

```
<img width="566" alt="Capture d’écran 2025-04-30 à 10 36 28" src="https://github.com/user-attachments/assets/51eda477-956d-4154-b3df-b3a6ff6912ae" />











