/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
const dotenv = require('dotenv');
const faunadb = require('faunadb');
const { fetchFreshResult } = require('./services/weather.js');
const { getFromCache, saveToCache } = require('./services/cache.js');

dotenv.config();

async function getFromCacheIfFresh({ client, maxFreshnessInterval }) {
  const lastResponse = await getFromCache(client, faunadb.query);
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

exports.handler = async function (event, _context) {
  try {
    const client = new faunadb.Client({ secret: process.env.FAUNA_DB_KEY });

    const lastResponseKey = 'lastResponse';
    const maxFreshnessInterval = 87000;

    // Try to get a fresh cached result
    const lastResponse = await getFromCacheIfFresh({
      client,
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
    await saveToCache(data, client, faunadb.query);

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
};
