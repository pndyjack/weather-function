/* eslint-disable import/prefer-default-export */
import storage from 'node-persist';

export async function saveToCache({ key, data }) {
  await storage.init({ dir: '~' });
  await storage.setItem(key, data);
}

export async function getFromCache({ key }) {
  await storage.init({ dir: '~' });
  return storage.getItem(key);
}
