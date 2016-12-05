import Ember from 'ember';
import ENV from 'map/config/environment';

export default Ember.Route.extend({
     intl: Ember.inject.service(),
     beforeModel: function(){
        return this.get('intl').setLocale('en-us');

     },
    model: function(){
            var promise = Ember.$.ajax({
                    url: ENV.APP.apiEndpoint + '/depts'
            });
            return promise.then(function(response){
                return response.codes;
            });   
    }
});
