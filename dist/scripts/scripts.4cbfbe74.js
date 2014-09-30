"use strict";angular.module("asbuiltsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","autocomplete","nvd3ChartDirectives"]).config(["$routeProvider","$httpProvider",function(a,b){a.when("/",{templateUrl:"views/form.html",controller:"FormCtrl"}).when("/instructions",{templateUrl:"views/instructions.html"}).when("/form",{templateUrl:"views/form.html",controller:"FormCtrl"}).when("/stats",{templateUrl:"views/stats.html",controller:"StatsCtrl"}).when("/map",{templateUrl:"views/map.html",controller:"MapCtrl"}).otherwise({redirectTo:"/"}),b.defaults.useXDomain=!0,delete b.defaults.headers.common["X-Requested-With"]}]),angular.module("asbuiltsApp").controller("StatsCtrl",["$scope",function(a){a.xAxisTickFormatFunction=function(){return function(a){return d3.time.format("%b")(new Date(a))}};var b=d3.scale.category20b();a.colorFunction=function(){return function(a,c){return b(c)}},a.xFunction=function(){return function(a){return a[0]}},a.yFunction=function(){return function(a){return a[1]}},a.exampleData=[{key:"Series 1",values:[[10254096e5,0],[1028088e6,-6.3382185140371],[10307664e5,-5.9507873460847],[10333584e5,-11.569146943813],[10360404e5,-5.4767332317425],[10386324e5,.50794682203014],[10413108e5,-5.5310285460542],[10439892e5,-5.7838296963382],[10464084e5,-7.3249341615649],[10490868e5,-6.7078630712489],[10516752e5,.44227126150934],[10543536e5,7.2481659343222],[10569456e5,9.2512381306992]]},{key:"Series 2",values:[[10254096e5,0],[1028088e6,0],[10307664e5,0],[10333584e5,0],[10360404e5,0],[10386324e5,0],[10413108e5,0],[10439892e5,0],[10464084e5,0],[10490868e5,0],[10516752e5,0],[10543536e5,0],[10569456e5,0],[1059624e6,0],[10623024e5,0],[10648944e5,0],[10675764e5,0],[10701684e5,0],[10728468e5,0],[10755252e5,-.049184266875945]]}]}]),angular.module("asbuiltsApp").controller("MapCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("asbuiltsApp").controller("FormCtrl",["$scope","$http","$filter",function(a,b,c){function d(b,c){for(var d in a.servers[0].test.layers)for(var e in a.servers[0].test.layers[d])if(a.servers[0].test.layers[d][e].name===b){var f=a.servers[0].test.FeatureServer+"/"+a.servers[0].test.layers[d][e].id+"/"+c;return f}}function e(a,b,c,d){for(var e in a)for(var f in b)a[e].attributes[c]===b[f].attributes[c]&&(a[e].attributes[d]=b[f].attributes[d])}function f(a){var b=[];for(var c in a)b.push(a[c].attributes.DOCID);return b.sort(function(a,b){return b-a}),b[0]}function g(b){for(var c in a.sheets)1===a.sheets[c].attributes[b]?a.sheets[c].attributes[b]="True":0===a.sheets[c].attributes[b]&&(a.sheets[c].attributes[b]="False")}a.pageControls={continueButton:!1,deleteLastRecord:!1,table:!1,noRecords:!1},a.fields=null,a.projects=null,a.formSuccess=!1,a.selections=[{name:!0,id:1},{name:!1,id:0}],a.selectionOptions={project:"--Please Select Project--",doctype:"--Please Select Document Type--",engineer:"--Please Select Engineering Firm--",tf:"--Please Select--",sheet:"--Please Select Sheet--"};var h=0;a.servers=[{test:{FeatureServer:"http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer",layers:[]}},{WAKE:{Addresses:"http://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query"}}];var i=function(c,d,e){var f={f:"json",outFields:"*",where:"OBJECTID >"+c,orderByFields:d+" ASC",returnGeometry:!1};for(var g in a.servers[0].test.layers)for(var h in a.servers[0].test.layers[g])if(a.servers[0].test.layers[g][h].name===e){var i=a.servers[0].test.FeatureServer+"/"+a.servers[0].test.layers[g][h].id+"/query";b.get(i,{params:f}).success(function(b){if("RPUD.ENGINEERINGFIRM"===e&&(a.engfirms=b.features),"Project Tracking"===e){a.projects=b.features,a.projectnames=[];for(var c in a.projects)a.projectnames.push(a.projects[c].attributes.PROJECTNAME+":"+a.projects[c].attributes.DEVPLANID+":"+a.projects[c].attributes.PROJECTID)}"RPUD.PTK_DOCUMENTS"===e&&(a.fields=b.fields),"RPUD.SHEETTYPES"===e&&(a.sheetdisc=b.features),"RPUD.DOCUMENTTYPES"===e&&(a.doctypes=b.features)})}};b.get(a.servers[0].test.FeatureServer,{params:{f:"json"},cache:!0}).success(function(b){a.servers[0].test.layers.push(b.layers),a.servers[0].test.layers.push(b.tables),setTimeout(function(){i(h,"OBJECTID","RPUD.PTK_DOCUMENTS"),i(h,"PROJECTNAME","Project Tracking"),i(h,"SIMPLIFIEDNAME","RPUD.ENGINEERINGFIRM"),i(h,"SHEETTYPE","RPUD.SHEETTYPES"),i(h,"DOCUMENTTYPE","RPUD.DOCUMENTTYPES")},1e3)}),console.log(a.projects),a.change=function(h){var i=h.split(":");console.log(h),console.log(i),a.form.PROJECTID=i[2],console.log(i[2]),a.form.DEVPLANID=i[1],console.log(i[1]),a.form.PROJECTNAME=i[0],console.log(i[0]);var j=["SEALDATE","SEALNUMBER","ENGID","FORMERNAME","ALIAS"],k={f:"json",outFields:"*",where:"DEVPLANID =  '"+i[1]+"'",orderByFields:"DOCID ASC",returnGeometry:!1},l=d("RPUD.PTK_DOCUMENTS","query");b.get(l,{params:k}).success(function(b){if(console.log(b),a.sheets=b.features,e(a.sheets,a.doctypes,"DOCTYPEID","DOCUMENTTYPE"),e(a.sheets,a.sheetdisc,"SHEETTYPEID","SHEETTYPE"),e(a.sheets,a.engfirms,"ENGID","SIMPLIFIEDNAME"),g("WATER"),g("SEWER"),g("REUSE"),g("STORM"),a.sheetFields=b.fields,0===a.sheets.length){a.pageControls.table=!1,a.pageControls.noRecords=!0;for(var d in j)a.form[j[d]]=null;a.form.DOCID=1}else{a.pageControls.table=!0,a.pageControls.noRecords=!1,a.form.DOCID=f(a.sheets)+1;for(var d in j)a.form[j[d]]=a.sheets[0].attributes[j[d]],a.form.SEALDATE=c("date")(a.sheets[0].attributes.SEALDATE,"yyyy-MM-dd"),a.selectionOptions.engineer=a.sheets[0].attributes.SIMPLIFIEDNAME}})},a.autoFill=function(c){var d={f:"json",outFields:"ADDRESS",text:c,returnGeometry:!1,orderByFields:"ADDRESS ASC"},e=a.servers[1].WAKE.Addresses;b.get(e,{params:d,cache:!0}).success(function(b){console.log(b),a.streets=[];for(var c in b.features)a.streets.push(b.features[c].attributes.ADDRESS)})},a.nextSheet=function(){a.selectionOptions.project=a.entry.PROJECTNAME,a.pageControls.table=!0;for(var b in a.engfirms)a.entry.ENGID===a.engfirms[b].attributes.ENGID&&(a.selectionOptions.engineer=a.engfirms[b].attributes.SIMPLIFIEDNAME);a.form={PROJECTNAME:a.entry.PROJECTNAME,SEALDATE:a.lastDate,SEALNUMBER:a.entry.SEALNUMBER,DOCID:a.entry.DOCID+1,ENGID:a.entry.ENGID,DEVPLANID:a.entry.DEVPLANID,JURISDICTION:a.entry.JURISDICTION,PROJECTID:a.entry.PROJECTID}},a.delete=function(){var c=d("RPUD.PTK_DOCUMENTS","deleteFeatures");b.post(c,a.postResults,{params:{f:"json",objectIds:a.postResults.objectId},headers:{"Content-Type":"text/plain"}}).success(function(b){console.log(b),a.form.DOCID===a.entry.DOCID+1&&(a.form.DOCID=a.entry.DOCID),a.sheets.pop()}),0===a.sheets.length&&(a.pageControls.table=!1,a.pageControls.noRecords=!0,a.sheets=[])},a.submit=function(c){a.lastDate=c.SEALDATE;var e=c.SEALDATE.split("-"),f=e[1]+"/"+e[2]+"/"+e[0],g={PROJECTNAME:c.PROJECTNAME,SEALDATE:f,SEALNUMBER:c.SEALNUMBER,DOCTYPEID:c.DOCTYPEID.attributes.DOCTYPEID,DOCID:c.DOCID,ENGID:c.ENGID.attributes.ENGID,WATER:c.WATER.id,SEWER:c.SEWER.id,REUSE:c.REUSE.id,STORM:c.STORM.id,FORMERNAME:c.FORMERNAME||null,ALIAS:c.ALIAS||null,DEVPLANID:c.DEVPLANID,STREET_1:c.STREET_1||null,STREET_2:c.STREET_2||null,STREET_3:c.STREET_3||null,STREET_4:c.STREET_4||null,NOTES:c.NOTES||null,TAGS:c.TAGS||null,PROJECTID:c.PROJECTID,SHEETTYPEID:c.SHEETTYPEID.attributes.SHEETTYPEID};a.sheets!==!1&&(g.SEALDATE=a.sheets.SEALDATE,a.sheets=[]),a.pageControls.table=!1,a.entry=g,a.entry.SIMPLIFIEDNAME=c.ENGID.attributes.SIMPLIFIEDNAME;var h=[{attributes:g}],i=angular.toJson(h),j={params:{f:"json",features:i},headers:{"Content-Type":"text/plain"}},k=d("RPUD.PTK_DOCUMENTS","addFeatures");b.post(k,g,j).success(function(b){console.log(b),a.form.$setPristine(),a.form={},a.postResults=b.addResults[0],a.sheets.push({attributes:g})}),a.pageControls.deleteLastRecord=!0,a.pageControls.continueButton=!0},a.over,a.tableEdits={edit:{cell:function(c,d){var e={};e.OBJECTID=c,e[d]=a.table[d];var f=[{attributes:e}],g=angular.toJson(f),h={params:{f:"json",features:g},headers:{"Content-Type":"text/plain"}};b.post(a.servers[0].test.FeatureServer+"/"+a.servers[0].test.tables[0].id+"/updateFeatures",e,h).success(function(a){console.log(a)})}},"delete":{row:function(c){var e=d("RPUD.PTK_DOCUMENTS","deleteFeatures");b.post(e,a.postResults,{params:{f:"json",objectIds:c},headers:{"Content-Type":"text/plain"}}).success(function(b){console.log(b);for(var d in a.sheets)a.sheets[d].attributes.OBJECTID===c&&(console.log(d),a.sheets.splice(d,1))}),0===a.sheets.length&&(a.pageControls.noRecords=!0,a.pageControls.table=!1)}}}}]);