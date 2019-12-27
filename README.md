# weather-function
Netlify function to get weather data from the Dark Sky Weather API

## Features:
- Caches the response and serves it if it's not stale.

## Todo:
- Handle caching for multiple latitudes and longitudes. Currently the handler ignores the latitude and longitudes
  in the query params if the cached response is not stale.

## Dev env setup:
- Add your Fauna DB and Dark Sky API keys.
- Test locally using netlify-dev.
- Or deploy to Netlify Functions.
