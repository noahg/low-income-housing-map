L.mapbox.accessToken = 'pk.eyJ1Ijoibm9haGciLCJhIjoiaDZOQVlFayJ9.sKF3imccqs6EJE57Y3j2SA';

var geojson = {
  type: 'FeatureCollection',
  features: [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-77.03238901390978,38.913188059745586]
      },
      "properties": {
        "title": "Mapbox DC",
        "description": "1714 14th St NW, Washington DC",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "monument"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.414, 37.776]
      },
      "properties": {
        "title": "Mapbox SF",
        "description": "155 9th St, San Francisco",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "harbor"
      }
    }
  ]
};

var map = L.mapbox.map('map', 'mapbox.streets')
	       .featureLayer.setGeoJSON(geojson);

map.on('load', function() {
	map.setView([37.8, -96], 4)
});
