import Ember from 'ember';

export default Ember.Route.extend({
    model: function(){

           

            var buildingPromises = [];
            var allBuildingData = [];
            var allBuildings = [];
            var promise = $.ajax({
                    url: 'http://localhost:3000/depts'

            }).then(function(response){
                    
                    //console.log(response)
                    //console.log(response.deptData.department);
                    response.deptData.department.forEach( function( department ){
                           // console.log(department)
                            if( typeof department.department != 'undefined'){
                                
                                if(typeof department.department.code == 'string'){
                                        //console.log( department.department.code )
                                        // console.log('http://localhost:3000/courses/' + department.department.code)
                                        buildingPromises.push($.ajax({
                                                            url: 'http://localhost:3000/courses/' + department.department.code

                                        }).then( function(response){
                                            //console.log(response.length);
                                            allBuildingData.push(response);
                                            //allBuildings.push( response.buildingCode );
                                            return response;
                                        }) );
                                }
                                else{
                                    department.department.forEach(function( dept ){
                                           //console.log(dept.code)
                                          // console.log('http://localhost:3000/courses/' + dept.code)
                                         buildingPromises.push($.ajax({
                                                            url: 'http://localhost:3000/courses/' + dept.code

                                        }).then(function( response){
                                            //console.log(response);
                                            allBuildingData.push(response);
                                            //allBuildings.push( response.buildingCode );
                                            return response;

                                        }));
                                    })
                                }
                            }

                    } );
                    //return response;
                   // console.log(buildingPromises.length)
                    $.when.apply(null, buildingPromises).done(function(data) {
                        //console.log(buildingPromises)
                        var flattened = allBuildingData.reduce(function(a, b) {
                            return a.concat(b);
                            }, []);
                        console.log(flattened);
                        var unique = flattened.reduce( function( buildingArr , building  ){
                                //console.log( building.buildingCode )
                               // console.log(buildingArr)
                               // console.log( buildingArr.indexOf( building.buildingCode ) )
                                if( buildingArr.indexOf( building.buildingCode ) < 0  ){
                                    buildingArr.push( building.buildingCode )

                                }
                                return buildingArr
                                    //return ;

                        }, [] );
                        console.log( unique )
                        //console.log(allBuildings)
                        //console.log(data);
                    });

            });
        
            //return promise;

            
    }
});
