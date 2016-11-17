var request = require('request')
var express = require('express')
var cors = require('cors')
var async = require('async')
var app = express() 
//var aVar = "aVar";
var cache = require('apicache').middleware;

app.use(cors())
//app.use(cache('60 minutes'))



app.get('/', function (req, res) {
     res.send( 'Welcome' )
  
})

app.get('/buildings', function (req, res) {
     getUSCData( res ) 
  
})
 
app.get('/depts', function (req, res) {
    //
  request
        .get('http://web-app.usc.edu/web/soc/api/depts/20171', function(error, response, body) {
            var allBuildingData = []
            var deptData = JSON.parse(body)
            console.log("API hit");
            var totalDepts = deptData.department.reduce(function(sum, dept){
                    //return sum + dept.department.length
                    var increment = 0;
                    if(typeof dept.department == "object"){
                            if (Array.isArray( dept.department ))
                                increment = dept.department.length
                            else 
                                increment = 1
                            dept.departmentCount = increment
                    }
                    return sum + increment
                    
            }, 0) 

            /*
            M
            T 
            W
            H
            F
            */

            var deptUrls = [];
            deptData.department.forEach( function( department ){
                   if( typeof department.department != 'undefined'){
                        if(typeof department.department.code == 'string'){
                               //deptUrls.push( 'http://web-app.usc.edu/web/soc/api/classes/'+ department.department.code +'/20171' )
                               deptUrls.push( department.department.code )
                        }
                        else{
                            department.department.forEach(function( dept ){
                                //deptUrls.push( 'http://web-app.usc.edu/web/soc/api/classes/'+ dept.code +'/20171' )
                                deptUrls.push( dept.code )
                            })
                        }
                    }
            } );


            // console.log("Hit 2")
            // async.map( deptUrls, function( deptUrl ){
            //     request.get(deptUrl, function(error, response, body){
            //             var buildingData = JSON.parse(body)
            //             //console.log( body )
            //             allBuildingData.push( buildingData );
            //             //return buildingData
            //     })
            // },function(err, results){

            //         console.log(results)
            //         res.send( allBuildingData )
            // })


            



            res.send( {urls: deptUrls, count: deptUrls.length} );


            // async.map(deptData.department, function( department ){
            //         if( typeof department.department != 'undefined'){
            //             if(typeof department.department.code == 'string'){
            //                    request.get( 'http://web-app.usc.edu/web/soc/api/classes/'+ department.department.code +'/20171', 
            //                                     function(error, response, body) {
            //                                     }
            //                    );
                                       
            //             }
            //             else{
            //                 department.department.forEach(function( dept ){
            //                         var deptPromise = $.ajax({
            //                                         url: 'http://localhost:3000/courses/' + dept.code
            //                     }).then(function( response){
            //                         allBuildingData.push(response);
            //                         return response;

            //                     });
            //                     buildingPromises.push( deptPromise);
            //                 })
            //             }
            //         }

            // } );


            // res.send( {
            //     deptCount : totalDepts,
            //     deptData: deptData,
            //     isCached: 5
            // } )
        })

})

app.get('/courses/:course/:day', function (req, res) {
      request
        .get('http://web-app.usc.edu/web/soc/api/classes/'+ req.params.course +'/20171', function(error, response, body) {
            //console.log(response.statusCode) // 200 
            //console.log(response.headers['content-type']) // 'image/png' 
            //var uscData = eval(body)
             var buildingData = [] 
             //console.log(body)
             if(body.length){
                

            var courseData = JSON.parse(body)
            var offeredCourses = courseData['OfferedCourses']['course']
            //console.log(courseData['OfferedCourses'])
           
            //console.log(offeredCourses)
            for( var i=0; i < offeredCourses.length; i++ )
            {
                    console.log(typeof offeredCourses[i].CourseData.SectionData)
                    var sections = [];
                    if(typeof offeredCourses[i].CourseData.SectionData == 'array' ){
                        sections = offeredCourses[i].CourseData.SectionData.filter(function(section){ return !(section.day.indexOf(req.params.day) < 0 )  })
                    }
                    else{
                        console.log( offeredCourses[i].CourseData.SectionData.day )
                        if( offeredCourses[i].CourseData.SectionData.hasOwnProperty('day') )
                            console.log( Object.keys(offeredCourses[i].CourseData.SectionData.day).length)
                        if( offeredCourses[i].CourseData.SectionData.hasOwnProperty('day') 
                            && Object.keys(offeredCourses[i].CourseData.SectionData.day).length ){
                            sections = [offeredCourses[i].CourseData.SectionData].filter(function(section){ return !(section.day.indexOf(req.params.day) < 0 )  })
                        }
                    }
                   // console.log( sections )

                    for( var j =0; j < sections.length; j++ ){
                        var location = sections[j].location
                        if(typeof location == 'string'){
                            var locationCode = location.substring(0,3)
                            //console.log( location.day )
                            console.log(sections[j].day)
                            //if(sections[j].day.length){
                                var sectionDays = sections[j].day.split('')
                                console.log(sectionDays)
                                //sectionDays.forEach( function(day){
                                    //if( typeof buildingData[locationCode] == 'undefined' ){
                                    //        buildingData[locationCode] = []

                                    //}
                                    //else{
                                        buildingData.push( {
                                            buildingCode: locationCode,
                                            start: sections[j].start_time,
                                            end: sections[j].end_time,
                                            enrolled: sections[j].number_registered,
                                            day:sectionDays
                                            })
                                //}
                               // })
                            //}
                        }   
                        
                        //console.log( sections[j].start_time )
                        //console.log( sections[j].end_time )


                    }
            }

            //res.send( courseData.OfferedCourses )

            /*
            M
            T
            W
            H
            F
            */
             }
            res.send( buildingData )
        })
     //
})


app.get('/buildingtypes', function (req, res) {
       
    request.get('http://web-app.usc.edu/maps/all_map_data.js', function(error, response, body) {
         var lookup = {};
        var items = eval(body);
        var result = [];

        for (var item, i = 0; item = items[i++];) {
        var name = item.type;

        if (!(name in lookup)) {
            lookup[name] = 1;
            result.push(name);
        }
        }
        res.send( result )
     })
})

app.listen(3000)

function getUSCData( res ){

    request.get('http://web-app.usc.edu/maps/all_map_data.js', function(error, response, body) {
        console.log(response.statusCode) // 200 
        console.log(response.headers['content-type']) // 'image/png' 
        var uscData = eval(body)
        var filteredData = uscData.filter( function( building ){
                return building.campus == 1 && building.code != '' &&  building.type == 'Building'
        } )
        console.log(uscData)
        console.log(filteredData.length)


        res.send( filteredData )

        /*
        res.send( uscData.map(function(building){
            return {
                //name: building.name,
                type:building.type}

        } ) )
        */
     })
}
