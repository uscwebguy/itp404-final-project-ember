import { test } from 'qunit';
import moduleForAcceptance from 'map/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | books', {
  beforeEach: function(){
    window.server.createList('dept', 20);
    window.server.createList('booksearch', 1);

  },
  afterEach: function(){
    window.server.shutdown();

  }
});

test('visiting /books/:id/:sectionId/:courseId  contains two links in breadcrumbs', function(assert) { 
  visit('/books/:id/:sectionId/:courseId');

  andThen(function() {
    assert.equal(find('.breadcrumbs a').length, 2);
  });
});


test('visiting /books/:id/:sectionId/:courseId contains books with prices', function(assert) { 
  visit('/books/:id/:sectionId/:courseId');

  andThen(function() {
    //console.log()
    assert.equal(find('.new-price').text().trim(), '$100.00');
  });
});

test('visiting /books shows a list of depts', function(assert) { 
  visit('/');

  andThen(function() {
    //console.log(currentURL())
    assert.equal(find('.dept').length, 20);
  });
});

test('visiting / redirect to /books', function(assert) {
  visit('/');

  andThen(function() {
    //console.log(currentURL())
    assert.equal(currentURL(), '/books');
  });
});
