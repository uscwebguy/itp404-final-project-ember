var request = require('request')
var express = require('express')
var cors = require('cors')
var app = express() 
//var aVar = "aVar";
var cache = require('apicache').middleware;

app.use(cors())
app.use(cache('60 minutes'))



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
            //console.log(response.statusCode) // 200 
            //console.log(response.headers['content-type']) // 'image/png' 
            //var uscData = eval(body)
            var deptData = JSON.parse(body)
            //console.log(deptData.department)
            //console.log(Object.keys(deptData).length)
            console.log("API hit");
            var totalDepts = deptData.department.reduce(function(sum, dept){
                    //return sum + dept.department.length
                    var increment = 0;
                    if(typeof dept.department == "object"){
                           // console.log("start")
                            //console.log( dept.code );
                            //console.log( Array.isArray( dept.department ));
                            //console.log( dept.department.length );
                            if (Array.isArray( dept.department ))
                                increment = dept.department.length
                            else 
                                increment = 1
                            dept.departmentCount = increment
                    }
                    return sum + increment
                    
            }, 0)
            //console.log(totalDepts)
            //console.log(courseData['OfferedCourses']) 
            //res.send( courseData.OfferedCourses )

            /*
            M
            T
            W
            H
            F
            */

            res.send( {
                deptCount : totalDepts,
                deptData: deptData,
                isCached: 5
            } )
        })

})

app.get('/courses/:course', function (req, res) {
      request
        .get('http://web-app.usc.edu/web/soc/api/classes/'+ req.params.course +'/20171', function(error, response, body) {
            //console.log(response.statusCode) // 200 
            //console.log(response.headers['content-type']) // 'image/png' 
            //var uscData = eval(body)
             var buildingData = [] 
             if(body.length){
                

            var courseData = JSON.parse(body)
            var offeredCourses = courseData['OfferedCourses']['course']
            //console.log(courseData['OfferedCourses'])
           
            //console.log(offeredCourses)
            for( var i=0; i < offeredCourses.length; i++ )
            {
                    var sections = offeredCourses[i].CourseData.SectionData
                   // console.log( sections )

                    for( var j =0; j < sections.length; j++ ){
                        var location = sections[j].location
                        if(typeof location == 'string'){
                            var locationCode = location.substring(0,3)
                            //console.log( location.day )
                            console.log(sections[j].day)
                            if(sections[j].day.length){
                                var sectionDays = sections[j].day.split('')
                                console.log(sectionDays)
                                sectionDays.forEach( function(day){
                                    //if( typeof buildingData[locationCode] == 'undefined' ){
                                    //        buildingData[locationCode] = []

                                    //}
                                    //else{
                                        buildingData.push( {
                                            buildingCode: locationCode,
                                            start: sections[j].start_time,
                                            end: sections[j].end_time,
                                            enrolled: sections[j].number_registered,
                                            day:day
                                            })
                                //}
                                })
                            }
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
