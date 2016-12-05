import Ember from 'ember';


export default Ember.Route.extend({
    model: function(params){
        //console.log(params)
         this.controllerFor('books.add').set('isbn', params.isbn);
         this.controllerFor('books.add').set('sectionId', params.courseId);
        return params;

    }
});
