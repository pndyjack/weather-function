/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv';
import faunadb, { query as q } from 'faunadb';

dotenv.config();

export async function saveToCache(data) {
  const client = new faunadb.Client({ secret: process.env.FAUNA_DB_KEY });
  const createP = client.query(q.Create(q.Collection('forecast'), { data }));
  createP.then(r => {
    console.log(r);
  });
}

export async function getFromCache() {
  const x = q.Map(
    q.Paginate(
      q.Match(q.Index('forecast_sort_by_timestamp_desc')),
      { size: 1 },
      q.Lambda(['timestamp', 'ref'], q.Get(q.Var('ref'))),
    ),
  );
  x.then(r => console.log(r));
}
