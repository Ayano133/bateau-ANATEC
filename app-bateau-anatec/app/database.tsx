import * as SQLite from 'expo-sqlite';

// Initialiser la base de données
export const initDatabase = async () => {

  const db =  await SQLite.openDatabaseAsync('locations.db');

  await db.withTransactionAsync(async () =>{
    // Activer les clés étrangères (optionnel)
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Créer la table locations si elle n'existe pass
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL,
        longitude REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );`);
  });
};

// Sauvegarder une localisation
export const saveLocation = async (latitude: number, longitude: number) => {

  const db =  await SQLite.openDatabaseAsync('locations.db');

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'INSERT INTO locations (latitude, longitude) VALUES (?, ?);',
      [latitude, longitude]
    );
  });
};

// Récupérer toutes les localisations
export const fetchLocations = async () : Promise<any[]> => {

  const db =  await SQLite.openDatabaseAsync('locations.db');

  const allRows = await db.getAllAsync('SELECT * FROM locations;');
  for (const row of allRows) {
    console.log(row.id, row.latitude, row.longitude);
  }
  return allRows;
};

export default initDatabase;