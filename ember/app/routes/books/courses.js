import Ember from 'ember';
import ENV from 'map/config/environment';

export default Ember.Route.extend({
    model: function(params) {
        var courseCode = params.id;
        var promise = $.ajax({
                    url: ENV.APP.apiEndpoint + '/courselist/' + courseCode
        })
        return promise.then(function(response){
            return response;
        });
  }
});
