var request = require('request')
var express = require('express')
var app = express() 
 
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

            var totalDepts = deptData.department.reduce(function(sum, dept){
                    //return sum + dept.department.length
                    var increment = 0;
                    if(typeof dept.department == "object"){
                            console.log("start")
                            //console.log( dept.code );
                            console.log( Array.isArray( dept.department ));
                            //console.log( dept.department.length );
                            if (Array.isArray( dept.department ))
                                increment = dept.department.length
                            else 
                                increment = 1

                    }
                    return sum + increment
                    
            }, 0)
            console.log(totalDepts)
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
                deptData: deptData} )
        })

})

app.get('/courses', function (req, res) {
      request
        .get('http://web-app.usc.edu/web/soc/api/classes/itp/20171', function(error, response, body) {
            //console.log(response.statusCode) // 200 
            //console.log(response.headers['content-type']) // 'image/png' 
            //var uscData = eval(body)
            var courseData = JSON.parse(body)
            console.log(courseData['OfferedCourses']) 
            //res.send( courseData.OfferedCourses )

            /*
            M
            T
            W
            H
            F
            */

            res.send( courseData.OfferedCourses.course )
        })
     //
})


app.listen(3000)

function getUSCData( res ){

    request
    .get('http://web-app.usc.edu/maps/all_map_data.js', function(error, response, body) {
        console.log(response.statusCode) // 200 
        console.log(response.headers['content-type']) // 'image/png' 
        var uscData = eval(body)
        
        res.send( uscData.filter( function( building ){
                return building.campus == 1
        } ))
     })
}
