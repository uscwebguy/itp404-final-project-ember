import Ember from 'ember';
import ENV from 'map/config/environment';

export default Ember.Route.extend({
    model: function(params){
    
        
        var courseCode = params.courseId; 
        var promise = Ember.$.ajax({
                    url: ENV.APP.apiEndpoint + '/booksearch/' + params.sectionId + '-'  + courseCode
        });
        
        return promise.then(function(response){
            
            var ebayPromises = [];
            //var amazonPromises = [];
            
            response.forEach( function( bookObject ){
                var ebayPromise = Ember.$.ajax({
                                        url: ENV.APP.apiEndpoint + '/ebay/' + bookObject.ISBN
                                    });
                ebayPromises.push( ebayPromise );
                //var amazonPromise = $.ajax({
                //                         url: ENV.APP.apiEndpoint + '/amazon/' + bookObject.ISBN
                //                     });
              
               // amazonPromises.push( amazonPromise );
            } );
          
            return Ember.RSVP.all(ebayPromises).then(function(books) {
                    //console.log(books)
                    var mergedObject = response.map(function( book, index ){
                            return {        
                                    bookData: book,
                                    ebayData: books[index]
                            };
                    });
                   // var dept = courseCode.split('-');
                    return {
                        data:mergedObject,
                        course: params.sectionId,
                        dept: params.id,
                        section: params.courseId,
                        params:params
                    };
            });
        });
    }
});
