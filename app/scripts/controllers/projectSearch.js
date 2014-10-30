'use strict';

angular.module('asbuiltsApp')
    .service('ProjectSearch', ['ags', 'Options','$filter', function(ags, Options, $filter){
      //Add get set to Project prototype
      var options = new Options('json', '*', '', 'PROJECTNAME ASC', false );
      var s = ags.testServer.getService({serviceType: 'MapServer'}).$promise.then(function(res){
         var layers = new ags.Layers(res.layers.concat(res.tables));
         options.addOptions('id', layers.getLayerId('Project Tracking'));
      });
      return {
          autoFillProjects: function (typed) {
            var projects = [];
            function getSet (array){
              var temp = [];
              for (var i = 0, x = array.length; i < x; i++){
                temp.indexOf(temp[i]) ? array : temp.push(this[i]);
              }
              return temp;
            }

          //Adds typed text to options
          options.addOptions('text', typed.toUpperCase());
          //Search for the text form the server
          ags.features.getAll(options).$promise.then(function(data){
            try {
              if (data.features.length > 0){
                for (var i = 0, x = data.features.length; i < x; i++){
                   projects.push(data.features[i].attributes.PROJECTNAME + ':' + data.features[i].attributes.DEVPLANID + ':' + data.features[i].attributes.PROJECTID);
                }
                getSet(projects);
              }
              else {
                projects.push("Sorry No Record Found...");
              }
            } catch (error){
              console.log(error);
            }
          });
        return projects;
      } //autoFill
    } //return
}]); //ProjectSearch
