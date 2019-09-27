/* eslint-disable import/prefer-default-export */

async function saveToCache(data, client, q) {
  const result = client.query(q.Create(q.Collection('forecast'), { data }));
  result
    .then((res) => {
      console.debug(res);
    })
    .catch((err) => console.debug(err));
}

async function getFromCache(client, q) {
  const result = client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('forecast_sort_by_timestamp_desc')), {
        size: 1,
      }),
      q.Lambda(['timestamp', 'ref'], q.Get(q.Var('ref'))),
    ),
  );
  result
    .then((res) => {
      console.debug(res);
      return res.data;
    })
    .catch((err) => console.debug(err));
}

module.exports = { saveToCache, getFromCache };
