// src/services/indexedDBService.ts
import { openDB, IDBPDatabase } from 'idb';

// Constants for your DB
const DB_NAME = 'hangman_db';
const DB_VERSION = 1;
const STORE_NAME = 'users_store';
const KEY = 'users'; // We'll store the entire array of users under this key

// We'll keep a reference to the DB instance to avoid reopening repeatedly
let db: IDBPDatabase | null = null;

/**
 * getDB:
 *  - Opens (or creates) the IndexedDB database
 *  - Creates an object store if needed
 */
async function getDB(): Promise<IDBPDatabase> {
  if (!db) {
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(database) {
        // Create an object store if it doesn't exist
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return db;
}

/**
 * Retrieve the users array from IndexedDB.
 */
export async function getUsersFromDB(): Promise<any[]> {
  const database = await getDB();
  const tx = database.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const users = (await store.get(KEY)) || []; // if null, return an empty array
  await tx.done;
  return users;
}

/**
 * Store the entire users array in IndexedDB.
 */
export async function saveUsersToDB(users: any[]): Promise<void> {
  const database = await getDB();
  const tx = database.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.put(users, KEY);
  await tx.done;
}
