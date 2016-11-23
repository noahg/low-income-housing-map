mapboxAccessToken = 'pk.eyJ1Ijoibm9haGciLCJhIjoiaDZOQVlFayJ9.sKF3imccqs6EJE57Y3j2SA';
googleDocStoryDatabase = 'https://spreadsheets.google.com/feeds/list/1PUVQ6n10JfoXcNiJm_pXnnl8q2IaO-DJrfkXtE35MiE/1/public/full?alt=json'
attributionText = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="http://mapbox.com">Mapbox</a>'
mapboxBaseMaps = {
  'light': 'mapbox.light'
};
startingBounds = [47.27, -120.82];

colorPalatte = {
  'gray': '#DF5330',
  'dark_gray': '#505555',
  'green': '#238594',
  'orange': '#DF5330',
  'red': '#C4222A',
  'dark_red': '#C4222A',
};


function addField(id, field_name, field_value) {
    ldshapes.features[id].properties[field_name] = field_value;
};

$.getJSON(googleDocStoryDatabase, function(data) {

  var entry = data.feed.entry;

  $(entry).each(function(){

    //console.log(this.gsx$ld.$t + ' ' + this.gsx$storytitle.$t)

    var id = this.gsx$ld.$t - 1

    if (this.gsx$storytitle.$t) {
        addField(id, 'story_title', this.gsx$storytitle.$t);
        console.log(this.gsx$storytitle.$t);
    };

    if (this.gsx$storytext.$t) {
        addField(id, 'story_text', this.gsx$storytext.$t);
    };

    console.log('adding fields')


  });

});

function getZoom() {
  zoom = 7
  return zoom;
}

var map = L.map('map', {zoomControl: false}).setView(startingBounds, getZoom());

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken , {
  maxZoom: 18,
  attribution: attributionText,
  id: mapboxBaseMaps.light
}).addTo(map);

new L.Control.Zoom({ position: 'topright' }).addTo(map);

var districtNumberDiv = document.getElementById('districtNumber');
var htfUnitsValueDiv = document.getElementById('htfUnitsValue');
var homelessSchoolchildrenValueDiv = document.getElementById('homelessSchoolchildrenValue');

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: colorPalatte.green,
        fillOpacity: 0
    };
};

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: colorPalatte.dark_gray,
        fillOpacity: 0.2,
    });

    districtNumberDiv.update(layer.feature.properties);
    htfUnitsValueDiv.update(layer.feature.properties);
    homelessSchoolchildrenValueDiv.update(layer.feature.properties);

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
};

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });

    if (feature.properties) {
        layer.bindPopup("<span id='storyTitle'>" + feature.properties.story_title + 
          "</span><br> from Legislative District " + feature.properties.district_n
          + '<br><span"><img width="80%" src="assets/story-photo.png"></span>'
          + '<p>' + feature.properties.story_text+ '</p>'
         );

    console.log('adding popups')
    }
};

districtNumber.update = function (props) {
  this.innerHTML = props.district_n
};

htfUnitsValueDiv.update = function (props) {
  var number = props.totalunits
  var string = numeral(number).format('0,0');
  this.innerHTML = string
};

homelessSchoolchildrenValueDiv.update = function (props) {
  var number = props.homeless_s
  var string = numeral(number).format('0,0');
  this.innerHTML = string
};

geojson = L.geoJson(ldshapes, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);