import Ember from 'ember';

export default Ember.Route.extend({
    model: function(){

            var buildingPromises = [];
            var allBuildingData = [];
            var promise = $.ajax({
                    url: 'http://localhost:3000/depts'
            }).then(function(response){  
                    response.urls.forEach( function( department ){
                            var deptPromise = $.ajax({
                                                url: 'http://localhost:3000/courses/' + department + '/M'
                            }).then( function(response){
                                allBuildingData.push(response);
                                return response;
                            });
                            buildingPromises.push( deptPromise );


                    } );
                     return Ember.RSVP.all(buildingPromises).then(function(posts) {
                        var flattened = allBuildingData.reduce(function(a, b) { return a.concat(b); }, []);

                        var unique = flattened.reduce( function( buildingArr , building  ){
                                var name = $.grep(markers, function(e){ return e.code == building.buildingCode });
                                   var buildingName = "";
                                   if( name.length > 0 ){
                                        buildingName = name[0].name;
                                    }
                                    if( building.buildingCode in buildingArr  ){
                                        //console.log("1");
                                        if( building.day in buildingArr[building.buildingCode]  ){
                                            //console.log("2");
                                            //buildingArr[building.buildingCode][building.day] = {};
                                            buildingArr[building.buildingCode][building.day]['count'] += parseInt( building.enrolled );
                                        }
                                        else{
                                            //console.log("3");
                                           // buildingArr[building.buildingCode] = {};
                                           // buildingArr[building.buildingCode][building.day] = {};
                                           buildingArr[building.buildingCode]['buildingName'] = buildingName;
                                            buildingArr[building.buildingCode][building.day] = {
                                                count: parseInt( building.enrolled ),
                                                code: building.buildingCode
                                                };
                                        }
                                    }
                                    else{
                                        //console.log("4");
                                        buildingArr[building.buildingCode] = {};
                                        buildingArr[building.buildingCode]['buildingName'] = buildingName;
                                        buildingArr[building.buildingCode]['buildingCode'] = building.buildingCode;
                                       // buildingArr[building.buildingCode][building.day] = {};
                                            buildingArr[building.buildingCode][building.day] = {
                                                count: parseInt( building.enrolled ),
                                                code: building.buildingCode
                                                };
                                    }
                                    return buildingArr;

                                }, {} );
                        console.log( unique )
                        return unique;
                    // posts contains an array of results for the given promises
                    });  
            });

            return promise
           



            //          var promise2 =  $.when.apply(null, buildingPromises).done(function(data) {
                   
                            
            //                     //console.log( allBuildingData )
            //                     //console.log("ib dtufdsf");
            //                     var flattened = allBuildingData.reduce(function(a, b) { return a.concat(b); }, []);
            //                     console.log("Flat", flattened)
            //                     var unique = flattened.reduce( function( buildingArr , building  ){
            //                         //var name = $.grep(response, function(e){ return e.code == building.buildingCode });
            //                        // if( name.length == 0 ){
            //                             var buildingName = "";

            //                         //}
            //                         //else{
            //                         //    var buildingName = name[0].name;

            //                         //}
            //                         //console.log(name[0])
            //                         if( building.buildingCode in buildingArr  ){
            //                             if( building.day in buildingArr[building.buildingCode]  ){
            //                                 //buildingArr[building.buildingCode][building.day] = {};
            //                                 buildingArr[building.buildingCode][building.day]['count'] += parseInt( building.enrolled );
            //                             }
            //                             else{
                                            
            //                                // buildingArr[building.buildingCode] = {};
            //                                // buildingArr[building.buildingCode][building.day] = {};
            //                                buildingArr[building.buildingCode]['buildingName'] = buildingName;
            //                                 buildingArr[building.buildingCode][building.day] = {
            //                                     count: parseInt( building.enrolled ),
            //                                     code: building.buildingCode
            //                                     };
            //                             }
            //                         }
            //                         else{
            //                             buildingArr[building.buildingCode] = {};
            //                             buildingArr[building.buildingCode]['buildingName'] = buildingName;
            //                            // buildingArr[building.buildingCode][building.day] = {};
            //                                 buildingArr[building.buildingCode][building.day] = {
            //                                     count: parseInt( building.enrolled ),
            //                                     code: building.buildingCode
            //                                     };
            //                         }
            //                         return buildingArr;

            //                     }, {} );
            //                     console.log( unique )
            //                     return unique;


                         
            //         });
            //         //console.log(promise2)
            //         //return promise2;
            // console.log("1", promise2)
            // return promise;
    }
});
