import Ember from 'ember';

export default Ember.Route.extend({
    model: function(){
            console.log(markers)
            var buildingPromises = [];
            var allBuildingData = [];
            var promise = $.ajax({
                    url: 'http://localhost:3000/depts'

            }).then(function(response){
                    
                    response.deptData.department.forEach( function( department ){

                            if( typeof department.department !== 'undefined'){
                                
                                if(typeof department.department.code === 'string'){
                                        var deptPromise = $.ajax({
                                                            url: 'http://localhost:3000/courses/' + department.department.code
                                        }).then( function(response){
                                            allBuildingData.push(response);
                                            return response;
                                        });
                                        buildingPromises.push( deptPromise );
                                }
                                else{
                                    department.department.forEach(function( dept ){
                                         var deptPromise = $.ajax({
                                                            url: 'http://localhost:3000/courses/' + dept.code
                                        }).then(function( response){
                                            allBuildingData.push(response);
                                            return response;

                                        });
                                        buildingPromises.push( deptPromise);
                                    });
                                }
                            }

                    } );
                    return response;




                    
            }).then(function(response){



           var promise2 =  $.when.apply(null, buildingPromises).done(function(data) {
                   
                            
                                //console.log( allBuildingData )
                                //console.log("ib dtufdsf");
                                var flattened = allBuildingData.reduce(function(a, b) { return a.concat(b); }, []);
                                console.log("Flat", flattened)
                                var unique = flattened.reduce( function( buildingArr , building  ){
                                    //var name = $.grep(response, function(e){ return e.code == building.buildingCode });
                                   // if( name.length == 0 ){
                                        var buildingName = "";

                                    //}
                                    //else{
                                    //    var buildingName = name[0].name;

                                    //}
                                    //console.log(name[0])
                                    if( building.buildingCode in buildingArr  ){
                                        if( building.day in buildingArr[building.buildingCode]  ){
                                            //buildingArr[building.buildingCode][building.day] = {};
                                            buildingArr[building.buildingCode][building.day]['count'] += parseInt( building.enrolled );
                                        }
                                        else{
                                            
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
                                        buildingArr[building.buildingCode] = {};
                                        buildingArr[building.buildingCode]['buildingName'] = buildingName;
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


                        
                    });
                    console.log(promise2)
                    return promise2;
            });
            console.log(promise)
            return promise;
    }
});
