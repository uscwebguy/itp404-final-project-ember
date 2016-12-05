import Ember from 'ember';

export default Ember.Route.extend({
    model: function(){

            var promise = $.ajax({
                    url: 'http://localhost:3000/buildings'

            }).then(function(response){
                    //console.log(response)
                    console.log(response);
                    return response;
            });

            return promise;

    }
});
