import Ember from 'ember';
import ENV from 'map/config/environment';

export default Ember.Controller.extend({
    actions: {
        addToFavorites: function(e) {
            e.preventDefault();
            //console.log(this.get('isbn'))
            var isbn = this.get('isbn'); 
            var sectionId = this.get('sectionId'); 
            var studentId = this.get('studentId'); 
            console.log( isbn );
            console.log( sectionId );
            console.log( studentId );
            var savedThis = this;
             var promise = Ember.$.ajax({
                        type: 'post',
                        url: ENV.APP.apiEndpoint + '/addfavorite',
                        data: {
                            isbn: isbn,
                            section: sectionId,
                            studentId: studentId
                        }
                    });
             promise.then(function(favorite){
                
                savedThis.transitionToRoute('books.list', favorite.studentId);
            });
        }
    }
});
