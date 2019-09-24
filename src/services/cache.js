/* eslint-disable import/prefer-default-export */
import storage from 'node-persist';
import os from 'os';

export async function saveToCache({ key, data }) {
  await storage.init({ dir: os.homedir() });
  await storage.setItem(key, data);
}

export async function getFromCache({ key }) {
  await storage.init({ dir: os.homedir() });
  return storage.getItem(key);
}
