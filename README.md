ITP 404 Final Project

USC Book Search
Site located at http://uscbooksearch.surge.sh
API located at https://itp404booksearch.herokuapp.com

Using the USC Schedule of Classes web service, the USC Bookstore required book files (http://www.usc.edu/aux-services/bookstore/booklist/) and the ebay API, I created a simple way to search for books requiered for a course.

First, the user chooses a department from the left hand sidebar. This will populate a list of courses in the body of the page. 

From here, they select a course, which will list all of the sessions for that course. When they select a session, if that session has books, those books will be listed, along with the price, the current lowest ebay price, and an option to add the book to favorites.

Adding the book to favorites shows a form where the user enters their id and the book is saved on the server

When user chooses to view "My Books", they enter their id and their saved books are retrieved.

How I fulfilled requirements:

API endpoints on Node:

/depts 
Retrieves departments from Schedule of Classes for Spring 2017
https://itp404booksearch.herokuapp.com/depts

/courselist/:course
Retrieves all courses from Schedule of Classes for a given dept , 
https://itp404booksearch.herokuapp.com/courselist/MATH

/sessionlist/:course
Retrieves all sessions for a course
This expects format MATH-530B
https://itp404booksearch.herokuapp.com/sessionlist/MATH-530B

/ebay/:isbn
Searches Ebay for a provided isbn, 
Created own module to search ebay
https://itp404booksearch.herokuapp.com/ebay/9783540438717

/booksearch/:searchid
Searches for all books for a given course and session 
https://itp404booksearch.herokuapp.com/booksearch/MATH-530B-39741

/booksearchbysession/:sessionid/:isbn
Searches for books by session and isbn
https://itp404booksearch.herokuapp.com/booksearchbysession/39741/9783540438717

/addfavorite (POST)
Expects studentId, isbn, and sectionid and saves favorite to Database

/getfavorites/:studentId
Retrieves saved favorites for a given student id
https://itp404booksearch.herokuapp.com/getfavorites/1234

Routes in Ember:
  this.route('books', function() {
    this.route('courses', { path: ':id' });
    this.route('sessions',  { path: ':id/:sectionId' });
    this.route('search',  { path: ':id/:sectionId/:courseId' });
    this.route('add', {path: 'add/:courseId/:isbn'});
    this.route('get');
    this.route('list', {path: 'list/:studentId'});
  });


Index redirects to /books

Choosing a department goes to
/books/courses 
Here are all courses for a dept are listed
http://uscbooksearch.surge.sh/books/MATH

Choosing a department transitions to 
/sessions route, which lists all the sessions for the chosen course, and has format /books/dept#/course#
http://uscbooksearch.surge.sh/books/MATH/MATH-530B

Choosing a session routes to 
/search which lists all books for chosen session, if there are any. This has the format /books/dept#/course#/session#
http://uscbooksearch.surge.sh/books/MATH/MATH-530B/39741

Here the user can also choose to Add to My Books, where they will routed to /books/add route
They can enter their student id to save the book to their favorites
This has format books/add/session#/isbn#
http://uscbooksearch.surge.sh/books/add/39741/9783540438717


After submitting, they are redirected to /books/list route, which has 
http://uscbooksearch.surge.sh/books/list/1234

User can also click on My Books link in top right corner, which will redirect them to /books/get route, where they can enter their student id and retrieve their favorites
After entering id, they are again redirected to /books/list route
http://uscbooksearch.surge.sh/books/get

Acceptance Tests:
Located at https://github.com/uscwebguy/itp404-final-project-ember/blob/master/ember/tests/acceptance/books-test.js
These are the acceptance test I performed:

filling form on /books/get sends us to list page
Here I checked that after the user fills in their id on the /books/get page, they are redirected to the /books/list page

visiting /books/:id/:sectionId/:courseId  contains two links in breadcrumbs
Here I verified that there are two links in the breadcrumbs when the users are on the /books/search route

visiting /books/:id/:sectionId/:courseId contains books with prices
Here I verifed that the rows on the table in /books/search route contain book prices

 visiting /books shows a list of depts
 Here I verified that the homepage has a department list in the left sidebar

 visiting / redirect to /books
 Here I verified that visting the home page redirects the user to the /books route


