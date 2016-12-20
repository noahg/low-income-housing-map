#WA Housing Map

This interactive web map showcases data & stories from each State Legislative District in Washington State. It is a joint project [YWCA of King, Pierce, and Snohomish](https://www.ywcaworks.org/) and the [Washington Low Income Housing Alliance](http://www.wliha.org). 

View the [live map](http://www.firesteelwa.org/map/).

It's a statically loaded  page that loads a static geojson file as the polygon geometry. Additional Legislative District attributes are joined from two sources. 

The first is a static json file that contains related data on the (counties that intersect each legislative district)[https://www.census.gov/geo/maps-data/data/sld_state.html]. This was produced using the (array_to_json())[https://www.postgresql.org/docs/9.6/static/functions-json.html] function in (a local PostgreSQL instance)[http://postgresapp.com/]. 





