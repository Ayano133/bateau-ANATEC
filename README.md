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

###Quelques exemples:

##Boutons:

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
              title="Mattéo"
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


### Conclusion:











