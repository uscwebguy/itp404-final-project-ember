import Ember from 'ember';

export default Ember.Controller.extend({
     actions: {
        getFavorites: function(e) {
            e.preventDefault();
            //console.log("gere")
            this.transitionToRoute('books.list', this.get('studentId'));
           
        }
    }
    //studentId
});
