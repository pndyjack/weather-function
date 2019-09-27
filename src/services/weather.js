/* eslint-disable import/prefer-default-export */
import axios from 'axios';

export async function fetchFreshResult({ lat, long }) {
  const response = await axios.get(
    `${process.env.BASE_API_URL}/${lat},${long}`,
    {
      headers: { Accept: 'application/json' },
    },
  );
  const { data } = response;
  return { timestamp: data.currently.time, ...data };
}
