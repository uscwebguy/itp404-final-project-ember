import Ember from 'ember';
import ENV from 'map/config/environment';

export default Ember.Route.extend({
     model: function(params){

        console.log(params)
        var courseCode = params.sectionId;
        var promise = $.ajax({
                    url: ENV.APP.apiEndpoint + '/sessionlist/' + courseCode
        })
        return promise.then(function(response){
            
            if(response){
                if(response.CourseData.SectionData.length){
                var sessions = response.CourseData.SectionData.map(function( section ){
                        return {
                            sectionid: response.PublishedCourseID + "-" + section.id,
                            instructor: section.instructor,
                            day: section.day,
                            times: section.start_time + "-" + section.end_time,
                            session: section.id

                        };
                });
                }
                else{
                    var session = {
                            sectionid: response.PublishedCourseID + "-" + response.CourseData.SectionData.id,
                            instructor: response.CourseData.SectionData.instructor,
                            day: response.CourseData.SectionData.day,
                            times: response.CourseData.SectionData.start_time + "-" + response.CourseData.SectionData.end_time,
                            session: response.CourseData.SectionData.id

                        };
                        sessions = [session];

                }
                return {
                    department: response.CourseData.prefix,
                    //courseNum: response.CourseData.,
                    course: response.PublishedCourseID,
                    sessions: sessions,
                    title: response.title
                };
            }
        });
    }

});
