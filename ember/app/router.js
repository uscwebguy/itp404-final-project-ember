import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('books', function() {
    this.route('courses', { path: ':id' });
    this.route('sessions',  { path: ':id/:sectionId' });
    this.route('search',  { path: ':id/:sectionId/:courseId' });
    this.route('add', {path: 'add/:courseId/:isbn'});
    this.route('get');
    this.route('list', {path: 'list/:studentId'});
  });
});

export default Router;
