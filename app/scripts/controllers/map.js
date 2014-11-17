'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('MapCtrl', ['$scope', '$http', '$filter', '$sce', 'leafletData', 'ProjectSearch', 'projectConstants', 'IconFactory',
    function ($scope, $http, $filter, $sce, leafletData, ProjectSearch, projectConstants, IconFactory) {

  $scope.searchStatus = false;
  //create a map in the "map" div, set the view to a given place and zoom
  angular.extend($scope, {
      center: {
        lat: 35.843768,
        lng: -78.6450559,
        zoom: 13
      },
      layers: {
            baselayers: {
                xyz: {
                    name: 'OpenStreetMap (XYZ)',
                    url: 'https://{s}.tiles.mapbox.com/v3/examples.3hqcl3di/{z}/{x}/{y}.png',
                    type: 'xyz'
                },
                raleigh:{

                  name: "Basic Base Map",
                    type: "dynamic",
                    url: "http://maps.raleighnc.gov/arcgis/rest/services/BaseMap/MapServer",
                    visible: false,
                    layerOptions: {
                        layers: ['*'],
                          opacity: 1,
                          attribution: "Copyright:© 2014 City of Raleigh"
                    }
                }
            },
            overlays: {
              projects:{
              name: "Project Tracking",
                type: "dynamic",
                url: "http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/MapServer",
                visible: false,
                layerOptions: {
                    layers: [2],
                      opacity: 0.5,
                      attribution: "Copyright:© 2014 City of Raleigh"
                },
              },
                sewer: {
                name: "Sewer Collection Network",
                  type: "dynamic",
                  url: "http://maps.raleighnc.gov/arcgis/rest/services/PublicUtility/SewerExternal/MapServer",
                  visible: false,
                  layerOptions: {
                      layers: [0,1,2,3,4],
                        opacity: 1,
                        attribution: "Copyright:© 2014 City of Raleigh"
                  }
            },
            water: {
              name: "Water Distribution Network",
                type: "dynamic",
                url: "http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/WaterDistribution/MapServer",
                visible: false,
                layerOptions: {
                    layers: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
                      opacity: 1,
                      attribution: "Copyright:© 2014 City of Raleigh"
                }
            },
            reuse: {
              name: "Reuse Distribution Network",
                type: "dynamic",
                url: "http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/ReclaimedDistribution/MapServer",
                visible: false,
                layerOptions: {
                    layers: [0,1,2,3,4,5,6,7,8,9,10,11],
                      opacity: 1,
                      attribution: "Copyright:© 2014 City of Raleigh"
                }
            }

          }


      },
      legend: {
            position: 'bottomleft',
            colors: [ '#FFF', '#28c9ff', '#0000ff', '#ecf386', '#28c9ff', '#0000ff', '#FFF'],
            labels: [
                '<img src="../images/ab.png" height="20px" width="20px" /> AS-Built',
                '<img src="../images/cp.png" height="20px" width="20px" /> Construction Plan',
                '<img src="../images/al.png" height="20px" width="20px" /> Acceptance Letter',
                '<img src="../images/wl.png" height="20px" width="20px" /> Warranty Letter',
                '<img src="../images/soc.png" height="20px" width="20px" /> Statement of Cost',
                '<img src="../images/p.png" height="20px" width="20px" /> Permits',
                '<img src="../images/plat.png" height="20px" width="20px" /> Plats' ]
        },



  });
//   $scope.$watch('geojson', function(newVal, oldVal){
//     console.log($scope.geojson);
// }, true);
// console.log($scope.layers.overlays.projects);



//
//
// var Mygeojson = function (data){
//     this.data = data;
//     this.icons = [];
//     this.styles = [];
//     this.addIcon = function (name, message, icon) {
//       this.icons.push({name: name, message: message, icon: icon});
//     }
// };
//
// Mygeojson.prototype.getCentroid = function () {
//   var arr = this.data;
//   return arr.reduce(function (x,y) {
//       return [x[0] + y[0]/arr.length, x[1] + y[1]/arr.length]
//   }, [0,0])
// }

var styles = {
        paidStyle: {
            fillColor: '#aa3939',
            radius: 5,
            color: '#550000',
            weight: 1,
            fillOpacity: 0.7
        },
        expiredStyle :{
            fillColor: 'rgba(247,247,247, 0.1)',
            weight: 5,
            opacity: 1,
            color: 'rgb(252,141,89)',
            dashArray: '3',
            fillOpacity: 0.7
        },
        hoverStyle: {
            fillColor: '#0ab25d',
            radius: 5,
            color: '#0ab25d',
            weight: 1,
            fillOpacity: 0.7
        }
    };



function getCentroid (arr) {
    return arr.reduce(function (x,y) {
        return [x[0] + y[0]/arr.length, x[1] + y[1]/arr.length]
    }, [0,0])
}


function removeMarkers(){
  $scope.markers = {};
}
// iconUrl, iconSize, iconAnchor, popupAnchor
var icons = new IconFactory();
 icons.addIcon('ASBUILTS', 'AS-Builts', '../images/ab.png', [38, 38], [0,0], [5,5]);
 icons.addIcon('CONSTUCTION_PLAN', 'Construction Plan', '../images/cp.png', [38, 38], [0,0], [5,0]);
 icons.addIcon('ACCEPTANCE_LETTER', 'Acceptance Letter', '../images/al.png', [38, 38], [0,0], [-5,5]);
 icons.addIcon('WARRANTY_LETTER', 'Warranty Letter', '../images/wl.png', [38, 38], [0,0], [5,-5]);
 icons.addIcon('STATEMENT_OF_COST', 'Statement of Cost', '../images/soc.png', [38, 38], [0,0], [-5,0]);
 icons.addIcon('PERMITS', 'Permit', '../images/p.png', [38, 38], [0,0], [-5,-5]);
 icons.addIcon('Plat', 'Plat', '../images/plat.png', [38, 38], [0,0], [5,5]);

//List of Icons
var document_types = icons.list;


var document_fx = function (latlng){
  latlng = {lat: latlng[0], lng: latlng[1]};
  var docs = [
          {
            lat: latlng.lat + 0.001,
            lng: latlng.lng + 0.001
          },
          {
            lat: latlng.lat,
            lng: latlng.lng + 0.002
          },
          {
            lat: latlng.lat + 0.001,
            lng: latlng.lng - 0.001
          },
          {
            lat: latlng.lat - 0.001,
            lng: latlng.lng + 0.001
          },
          {
            lat: latlng.lat,
            lng: latlng.lng - 0.002
          },
          {
            lat: latlng.lat - 0.001,
            lng: latlng.lng - 0.001
          },
          {
            lat: latlng.lat + 0.001,
            lng: latlng.lng - 0.0015
          }
    ];

angular.extend($scope, {
  markers:{},
  paths: {}
});



// function myStopFunction(stop) {
//     clearInterval(stop);
// }

for (var i in document_types){
  var tempName = document_types[i].name;

  $scope.markers[tempName] = docs[i];
  $scope.markers[tempName].draggable = true;
  $scope.markers[tempName].icon = document_types[i].icon;
  $scope.markers[tempName].message = document_types[i].message;
}



};


function action (feature, layer){
  $scope.viewData = feature;
  layer.bindPopup('<h4>PROJECT NAME:'+ feature.properties.PROJECTNAME +'</h4>');

  layer.on('mouseover', function (e) {
    $scope.viewData = feature.properties;
    layer.setStyle(styles.paidStyle);
    document_fx($scope.centroid);
 });
 layer.on('mouseout', function(){
   layer.setStyle(styles.expiredStyle);
   //removeMarkers();
 });
}


// var options = {
//     f: 'json',
//     outFields: '*',
//     where: 'OBJECTID > 0',
//     orderByFields:  'PROJECTNAME ASC',
//     returnGeometry: false
// };
//
// var conn = 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/2/query';
// $http.get(conn, {params: options, cache: true})
//   .success(function(res){
//     var poly = [];
//     for (var i = 0, f = res.features.length; i < f; i++){
//       $scope.projects.push(res.features[i].attributes.PROJECTNAME + ':' + res.features[i].attributes.DEVPLANID + ':' + res.features[i].attributes.PROJECTID);
//     }
// });
function removeEmptyFields (data) {
    for (var a in data){
      data[a] ? data[a] : delete data[a];
    }
}


$scope.autoFillProjects = function (typed) {
  //Turns on the map resulsts table
  $scope.searchStatus = false;
  $scope.project_docs = false;
  //Uses the Project Search Servies
  $scope.projects = ProjectSearch.autoFillProjects(typed);
}

$scope.searchControl = function (typed){
  console.log(typed);
  var selection = typed.split(':');
  var options = {
          f: 'json',
          outFields: '*',
          where: "PROJECTID =  '" + selection[2] + "'",
          outSR: 4326,
          returnGeometry: true
      };

  var conn = 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/2/query';
  var ptk_conn = 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/5/query';
  $http.get(conn, {params: options, cache: true})
    .success(function(res){
      leafletData.getMap().then(function(map) {
          $scope.project_info = res.features[0].attributes;
          $scope.project_info.CREATEDON = $filter('date')($scope.project_info.CREATEDON, 'MM/dd/yyyy');
          $scope.project_info.DEVPLAN_APPROVAL = $filter('date')($scope.project_info.DEVPLAN_APPROVAL, 'MM/dd/yyyy');
          $scope.project_info.EDITEDON = $filter('date')($scope.project_info.EDITEDON, 'MM/dd/yyyy');
          removeEmptyFields($scope.project_info);
                var latlngs = [];
                $scope.poly = [];
                $scope.bound = [];
                for (var i in res.features[0].geometry.rings[0]) {
                    var coord = res.features[0].geometry.rings[0][i];
                    var geo = res.features[0].geometry.rings;
                    for (var j in coord) {
                      latlngs.push([coord[1], coord[0]]);
                      $scope.poly.push(geo);
                      $scope.bound.push({lat: coord[1], lng: coord[0]});
                    }
                }
                $scope.mygeojson ={
                  "type": "FeatureCollection",
                  "features":[{
                    "type": "Feature",
                    "id": res.features[0].attributes.PROJECTID,
                    "properties": res.features[0].attributes,
                    "geometry": {
                      "type": "MultiPolygon",
                      "coordinates": $scope.poly
                    }
                  }]
                };
                console.log($scope.mygeojson);
                angular.extend($scope, {
                    geojson: {
                        data: $scope.mygeojson,
                        style: {
                            fillColor: 'rgba(252,141,0, 0.1)',
                            weight: 2,
                            opacity: 1,
                            color: 'rgb(252,141,89)',
                            dashArray: '4',
                            fillOpacity: 0.7
                        },
                        onEachFeature: action,
                       resetStyleOnMouseout: true
                    }
                });

                //Do not erase save for paths
                  // $scope.paths.p1.latlngs = $scope.bound;
                $scope.centroid = getCentroid(latlngs);

                map.fitBounds(latlngs);
                //Turns on the map resulsts table
                $scope.searchStatus = true;
            });
    });

    $http.get(ptk_conn, {params: options, cache: true})
      .success(function(res){
        console.log(res.features);

        $scope.project_docs = res.features.map(function (each){
          var url = {
              url : $sce.trustAsResourceUrl(projectConstants.documentBaseUrl + each.attributes.PROJECTID + "/" + each.attributes.PROJECTID + "-" + each.attributes.DOCTYPEID + "-" + each.attributes.DOCID + ".pdf"),
              name: each.attributes.PROJECTID + "-" + each.attributes.DOCTYPEID + "-" + each.attributes.DOCID,
              resid: each.attributes.PROJECTID + "-" + each.attributes.DOCTYPEID + "-" + each.attributes.DOCID + "res",
              icon: "../images/" + each.attributes.DOCTYPEID.toLowerCase() + ".png"
          };
          return url;
        });
        for (var a in $scope.project_docs){
          var ele_id = "#" + $scope.project_docs[a].resid;
          $(ele_id).resizable();
        }
      });

}


$scope.list1 = {title: 'AngularJS - Drag Me'};

//Setting Up Printing Service
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var printTask = 'http://mapstest.raleighnc.gov/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task/execute';
$scope.dpi = 90;
$scope.print_format = 'PDF';
$scope.exportSizes = [
  {
    size: [500, 500]
  },
  {
    size: [700, 500]
  },
  {
    size: [700, 1000]
  }
];
$scope.printFormatList = ["PDF", "PNG8", "PNG32", "JPG", "GIF", "EPS", "SVG",  "SVGZ"];
var web_map_specs = {
  "mapOptions":{ },
  "operationalLayers": [ ],
  "baseMap": [{
    title: 'Basemap',
    baseMapLayers:[
      {
          url: 'http://maps.raleighnc.gov/arcgis/rest/services/BaseMap/MapServer',
          opacity: 1
      }
    ]
  }],
  "exportOptions": {
      dpi: $scope.dpi,
      outputSize: [700, 500] || $scope.output
  }
  // "layoutOptions": { }
};

leafletData.getMap().then(function(map) {
    // web_map_specs.operationalLayers = [];
    map.on('move', function(){
      $scope.mapbounds = map.getBounds();
      web_map_specs.mapOptions.extent = {
        "xmin": $scope.mapbounds._southWest.lat,
        "ymin": $scope.mapbounds._southWest.lng,
        "xmax": $scope.mapbounds._northEast.lat,
        "ymax": $scope.mapbounds._northEast.lng
      };
      web_map_specs.operationalLayers = [];
        map.eachLayer(function (layer){
          //console.log(layer);
          //console.log(map.hasLayer(layer));

          map.hasLayer(layer) ? web_map_specs.operationalLayers.push({url: layer.url}) : console.log('No layers added to print');
        });
    });
    //Adds print control to map
    var printer = L.control({position: 'bottomright'});
    printer.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<button class="btn btn-primary btn-sm mapPrint" data-toggle="modal" data-target="#myModal">Print</button>';
        return div;
      };
printer.addTo(map);


});

$scope.print_params = {
  Web_Map_as_JSON: web_map_specs,
  format: $scope.print_format,
  Layout_Template: 'MAP_ONLY',
  f: 'json'
};

  $scope.$watch('print_params', function(newVal, oldVal){
    // console.log($scope.print_params);
}, true);

$scope.printMap = function () {
  $http.get(printTask, {
    params: $scope.print_params,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
    .success(function(res){
      console.log(res);
    });
}

  }]);
