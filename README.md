# Low Income Housing Stories and Data Visualization Map

This map showcases data and stories related to low-income housing by state legislative district in Washington State. It is a joint project [YWCA of King, Pierce, and Snohomish](https://www.ywcaworks.org/) and the [Washington Low Income Housing Alliance](http://www.wliha.org). 

## View the [live map](http://www.firesteelwa.org/map/).

It's a statically loaded page that displays legislative district polygons stored as static GeoJSON. Additional attributes are joined to each legislative district from two sources:

1. A static JSON file that contains related data on the [counties that intersect each legislative district](https://www.census.gov/geo/maps-data/data/sld_state.html). This was produced using the [array_to_json()](https://www.postgresql.org/docs/9.6/static/functions-json.html) function in [a local PostgreSQL instance](http://postgresapp.com/). 

2. A Google Sheet published as JSON that contains 'Story' text and media. This was done so non-technical staff users could easily and securely add stories and associated media it is gathered over the course of the coming year. I manually inspected the object to grab the fields I wanted to use. However, I discovered [Tabletop.js](https://github.com/jsoma/tabletop) after completing my version and would probably use that instead if using Google Sheets as an easy-to-use-and-permission tiny backend in the future.




