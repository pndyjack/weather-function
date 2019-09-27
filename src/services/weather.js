/* eslint-disable import/prefer-default-export */
const axios = require('axios');

async function fetchFreshResult({ lat, long }) {
  const response = await axios.get(
    `${process.env.BASE_API_URL}/${lat},${long}`,
    {
      headers: { Accept: 'application/json' },
    },
  );
  const { data } = response;
  return { timestamp: data.currently.time, ...data };
}

module.exports = { fetchFreshResult };
