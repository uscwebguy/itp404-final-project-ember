require('dotenv').config();
var request = require('request')
var express = require('express')
var cors = require('cors')
var async = require('async')
var app = express() 
//var aVar = "aVar";
var cache = require('apicache').middleware;
var bodyParser = require('body-parser')

var config = {devKey: process.env.ebay_dev_key};
//var ebay = require('ebay-sdk');
var amazon = require('./api/amazon')
var ebay = require('./api/ebay')
var Sequelize = require('sequelize');

var DB_NAME = process.env.DB_NAME;
var DB_USER = process.env.DB_USER;
var DB_PASSWORD = process.env.DB_PASS;
var sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST
});

var Favorite = sequelize.define('favorite', {
        
        studentId: {
            type: Sequelize.INTEGER,
            field: 'studentid'
        }, 
         isbn: {
            type: Sequelize.STRING,
            field: 'isbn'
        },
         sectionId: {
            type: Sequelize.INTEGER,
            field: 'sectionid'
        }
        },
         {
            timestamps:false
        }
);

app.use(cors())
app.use( bodyParser() );
app.use(cache('60 minutes'))


app.post( '/addfavorite', function(request, response){
    var favorite = Favorite.build({
        studentId: request.body.studentId,
        isbn: request.body.isbn,
        sectionId: request.body.section

    });

    favorite.save().then( function(favorite){
        response.json( favorite )

    } );
});

app.get( '/getfavorites/:studentId', function(request, response){
    var promise = Favorite.findAll({
            where: {
                studentid: request.params.studentId
            }
    }).then( function(results){
        response.json(results)


    } );

});

app.get('/', function (req, res) {
     res.send( '' )
  
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

            var deptCode = [];
            deptData.department.forEach( function( department ){
                   if( typeof department.department != 'undefined'){
                        if(typeof department.department.code == 'string'){
                               //deptUrls.push( 'http://web-app.usc.edu/web/soc/api/classes/'+ department.department.code +'/20171' )
                               deptCode.push( department.department.code )
                        }
                        else{
                            department.department.forEach(function( dept ){
                                //deptUrls.push( 'http://web-app.usc.edu/web/soc/api/classes/'+ dept.code +'/20171' )
                                deptCode.push( dept.code )
                            })
                        }
                    }

            } );
            res.send( {codes: deptCode, count: deptCode.length} );
        })
})

app.get('/courselist/:course', function (req, res) {
      request
        .get('http://web-app.usc.edu/web/soc/api/classes/'+ req.params.course +'/20171', function(error, response, body) {
            var jsonBody;
            try{

                var parsedBody = JSON.parse( body )
                jsonBody = {
                    deptCode: parsedBody.Dept_Info.abbreviation,
                    deptName: parsedBody.Dept_Info.department,
                    courses: parsedBody.OfferedCourses.course.map(function( course ){
                            return {
                                courseId: course.PublishedCourseID,
                                title: course.CourseData.title
                            };
                    })
                }


            }
            catch(e){
                jsonBody = {}

            } 
            res.send( jsonBody );
        });
});

app.get('/sessionlist/:course', function (req, res) {

    var courseArr = req.params.course.split('-');

      request
        .get('http://web-app.usc.edu/web/soc/api/classes/'+ courseArr[0] +'/20171', function(error, response, body) {
            var jsonBody = [];
            try{
                var parsedBody = JSON.parse( body )
                
                jsonBody = parsedBody.OfferedCourses.course.filter(function(course){
                    return course.CourseData.number == courseArr[1].substring(0,3)
                });

            }
            catch(e){
                
            }
            res.send( jsonBody[0] );

        });
});


app.get('/ebay/:isbn', function (req, res) {

    //var isbn = "9781442253674";

    ebay.search( req.params.isbn ).then( function(response){
        console.log( response );
       var ebayResult = response.reduce(
            function( lowestListing, currentListing ){
                    //<a href="{{ebayListing.viewItemURL}}" target="_blank">{{format-number ebayListing.sellingStatus.[0].currentPrice.[0].__value__ style="currency" currency="USD" }}</a>
                    console.log(lowestListing)


                    if( lowestListing.price == "" || lowestListing.price < currentListing.price ){
                        lowestListing = {
                          url: currentListing.viewItemURL[0],
                          price: currentListing.sellingStatus[0].currentPrice[0].__value__
                        };
                    }

                    return lowestListing;

                    //console.log(ebayObject)
                    //return ebayObject;
                }, 
                {url: "", price:""}
        );
        console.log(ebayResult)
        res.send(ebayResult);

    } );

})

app.get('/amazon/:isbn', function(request, response){
    amazon.search( request.params.isbn ).then( function( amazonResults ){
        console.log(amazonResults)
        response.send( amazonResults );
    } );
});


app.get('/booksearch/:searchid', function(req, res){
    
    var sessionId = req.params.searchid.split('-');

    request.get( 'http://www.usc.edu/aux-services/bookstore/booklist/171-' + sessionId[2] + '.json' , function(error, response, body) {
         
        var data = []
        try{
            var parsed = JSON.parse(body);
            data = parsed.filter(function( book ){
                return book.Department == sessionId[0] && book.Course == sessionId[1];
            });
        }
        catch(error){
        }
        res.send( data )
     })
});

app.get('/booksearchbysession/:sessionid/:isbn', function(req, res){
    
    var sessionId = req.params.sessionid;

    request.get( 'http://www.usc.edu/aux-services/bookstore/booklist/171-' + sessionId + '.json' , function(error, response, body) {
         
        var data = []
        try{
            var parsed = JSON.parse(body);
            data = parsed.filter(function( book ){
                console.log(book)
                return book.ISBN == req.params.isbn;
            });
        }
        catch(error){
        }
        res.send( data )
     })
});

app.listen(process.env.PORT || 3000)


