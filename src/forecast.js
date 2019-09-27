/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv';
import { fetchFreshResult } from './services/weather';
import { getFromCache, saveToCache } from './services/cache';

dotenv.config();

async function getFromCacheIfFresh({ lastResponseKey, maxFreshnessInterval }) {
  const lastResponse = await getFromCache();
  if (lastResponse && lastResponse.currently && lastResponse.currently.time) {
    // Get last response's date from UNIX timestamp
    const lastRespDate = new Date(lastResponse.currently.time * 1000);
    const currentDate = new Date();
    if (currentDate - lastRespDate > maxFreshnessInterval) {
      return undefined;
    }
  }
  return lastResponse;
}

export async function handler(event, _context) {
  try {
    const lastResponseKey = 'lastResponse';
    const maxFreshnessInterval = 87000;

    // Try to get a fresh cached result
    const lastResponse = await getFromCacheIfFresh({
      lastResponseKey,
      maxFreshnessInterval,
    });
    if (lastResponse) {
      return {
        statusCode: 200,
        body: JSON.stringify(lastResponse),
      };
    }

    // Fetch fresh result
    const { queryStringParameters } = event;
    const lat = queryStringParameters.lat || process.env.LAT;
    const long = queryStringParameters.long || process.env.LONG;
    const data = await fetchFreshResult({ lat, long });

    // Save to cache
    await saveToCache(data);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
}
