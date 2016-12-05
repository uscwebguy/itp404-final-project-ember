import Ember from 'ember';
import ENV from 'map/config/environment';

export default Ember.Route.extend({
    model: function(params){
            var promise = Ember.$.ajax({
                    url: ENV.APP.apiEndpoint + '/getfavorites/' + params.studentId
            });
            return promise.then(function(response){
                //return response;
                var promises = [];
                 response.forEach( function( bookObject ){
                    var newPromise = Ember.$.ajax({
                                            url: ENV.APP.apiEndpoint + '/booksearchbysession/' + bookObject.sectionId + "/" + bookObject.isbn
                                        });
                    promises.push( newPromise );
                    //var amazonPromise = $.ajax({
                    //                         url: ENV.APP.apiEndpoint + '/amazon/' + bookObject.ISBN
                    //                     });
                
                // amazonPromises.push( amazonPromise );
                } );
            
                return Ember.RSVP.all(promises).then(function(books) {
                        return books.map( function(book){
                            return book[0];

                        } );
                        
                });

                });   
    }

});
