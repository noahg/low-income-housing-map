/* SECTION: Constants */ 
mapboxAccessToken = 'pk.eyJ1Ijoibm9haGciLCJhIjoiaDZOQVlFayJ9.sKF3imccqs6EJE57Y3j2SA';
googleDocStoryDatabase = 'https://spreadsheets.google.com/feeds/list/1PUVQ6n10JfoXcNiJm_pXnnl8q2IaO-DJrfkXtE35MiE/1/public/full?alt=json'
attributionText = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="http://mapbox.com">Mapbox</a>'
mapboxBaseMaps = {
  'light': 'mapbox.light',
  'sat': 'mapbox.satellite',
  'streets': 'mapbox.streets',
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

/* SECTION: Initalize Map */
function getZoom() {
  zoom = 7
  return zoom;
};

var map = L.map('map', {zoomControl: false}).setView(startingBounds, getZoom());

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken , {
  maxZoom: 18,
  attribution: attributionText,
  id: mapboxBaseMaps.streets
}).addTo(map);

new L.Control.Zoom({ position: 'topright' }).addTo(map);

/* SECTION: Data Munging and Layer Loading */
//join intesecting county data to leg shapes (by leg id) 
function joinDataSetById(geojson_object, data_set_object) {
  $(geojson_object.features).each(function() {
    current_shape_index = this.properties.district_n;
    this.properties.intersecting_counties = data_set_object[current_shape_index];
  });
};

joinDataSetById(ldshapes, county_counts);

function addField(id, field_name, field_value) {
    ldshapes.features[id].properties[field_name] = field_value;
};

//fetch remote data
$.getJSON(googleDocStoryDatabase, function(data) {

  var entry = data.feed.entry;

  $(entry).each(function(){

    //manually join each rows  with remote data
    //console.log(this.gsx$ld.$t + ' ' + this.gsx$storytitle.$t)
    var id = this.gsx$ld.$t - 1

    if (this.gsx$storytitle.$t) {
        addField(id, 'story_title', this.gsx$storytitle.$t);
    };

    if (this.gsx$storytext.$t) {
        addField(id, 'story_text', this.gsx$storytext.$t);
    };

    if (this.gsx$storyphotourl.$t) {
        addField(id, 'story_photo_url', this.gsx$storyphotourl.$t);
    };

  });

  //inside so it doesn't load layer until all added data is joined
  console.log(ldshapes);
  geojson = L.geoJson(ldshapes, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

});

/* SECTION: View Munging */
//retrieve changing DOM nodes
var districtNumberDiv = document.getElementById('districtNumber');
var htfUnitsValueDiv = document.getElementById('htfUnitsValue');
var homelessSchoolchildrenValueDiv = document.getElementById('homelessSchoolchildrenValue');
var countiesTable = document.getElementById('countiesTable');

function stringifyIntegerField(number) {
  return numeral(number).format('0,0');
};

function stringifyFloatField(number) {
  return numeral(number).format('00.00');
};

//assign DOM nodes to fields
districtNumber.update = function (props) {
  this.innerHTML = props.district_n
};

htfUnitsValueDiv.update = function (props) {
  this.innerHTML = stringifyIntegerField(props.totalunits)
};

homelessSchoolchildrenValueDiv.update = function (props) {
  this.innerHTML = stringifyIntegerField(props.homeless_s)
};

function createRowString(row_object){

  var row_string = '<div class="row">'
                    +'<div class="col-xs-3 col-sm-3 col-md-3 alignLeft">' + row_object.county_name + '</div>'
                    +'<div class="col-xs-3 col-sm-3 col-md-3 alignCenter"><span class="tableValue logoRed">' + stringifyIntegerField(row_object.pit_unsheltered) + '</span></div>'
                    +'<div class="col-xs-3 col-sm-3 col-md-3 alignCenter"><span class="tableValue logoDarkGray">$' + stringifyIntegerField(row_object.median_home_price) + '</span></div>'
                    +'<div class="col-xs-3 col-sm-3 col-md-3 alignCenter"><span class="tableValue logoOrange">$' + stringifyFloatField(row_object.wage_1_bedroom) + '</span></div>'
                  +'</div>'

  return row_string;

};

function createTableString(table_collection){

  var tableString = '';
  var numberOfRows = $(table_collection).toArray().length;
  console.log(table_collection);

  for (rowNumber = 0; rowNumber < numberOfRows; rowNumber++) {
    currentRow = table_collection[rowNumber]
    tableString += createRowString(currentRow);

  };

  return tableString;
};

countiesTable.update = function (props) {

  //var table_string = createRowString(props.intersecting_counties[0]);
  
  //this.innerHTML =  table_string;
  this.innerHTML = createTableString(props.intersecting_counties);
};

//Specify layer handling
function updateSidebar(layer) {
    districtNumberDiv.update(layer.feature.properties);
    htfUnitsValueDiv.update(layer.feature.properties);
    homelessSchoolchildrenValueDiv.update(layer.feature.properties);
    countiesTable.update(layer.feature.properties);
};

//define initial style 
function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: colorPalatte.green,
        fillOpacity: 0
    };
};

//define interactivity effects
function highlightFeature(layer){
    layer.setStyle({
        weight: 3,
        color: colorPalatte.dark_gray,
        fillOpacity: 0.2,
    });
};

function resetHighlight(e) {
    geojson.resetStyle(e.target);
};

function focusOnFeature(e) {
    var layer = e.target;

    highlightFeature(layer);
    updateSidebar(layer);

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
};

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
};

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: focusOnFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });

    if (feature.properties.story_title && feature.properties.story_text) {
        layer.bindPopup("<span id='storyTitle'>" + feature.properties.story_title + 
          "</span><br> from Legislative District " + feature.properties.district_n
          + '<br><span"><img width="80%" src="' + feature.properties.story_photo_url +'"></span>'
          + '<p>' + feature.properties.story_text+ '</p>'
         );
    } else {
      //don't bind a pop-up if there isn't a title and text data
    };
};
