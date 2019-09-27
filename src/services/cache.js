/* eslint-disable import/prefer-default-export */
import faunadb from 'faunadb';

export async function saveToCache(data, dbKey) {
  const q = faunadb.query;
  const client = new faunadb.Client({ secret: dbKey });
  const result = client.query(q.Create(q.Collection('forecast'), { data }));
  result
    .then((res) => {
      console.debug(res);
    })
    .catch((err) => console.debug(err));
}

export async function getFromCache(dbKey) {
  const client = new faunadb.Client({ secret: dbKey });
  const q = faunadb.query;
  const result = client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('forecast_sort_by_timestamp_desc')), {
        size: 1,
      }),
      q.Lambda(['timestamp', 'ref'], q.Get(q.Var('ref'))),
    ),
  );
  result.then((res) => console.debug(res)).catch((err) => console.debug(err));
}
