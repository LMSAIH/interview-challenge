Welcome and thank you for reading! Here is my technical interview. I will separate this in 4 parts. The first: The steps to take, the second, the api endpoints, the third, all the features, and the fourth: the architecture and the reasoning behind it.

------------------FIRST-----------------------------

Steps to take: 

1) Clone the repo on your computer
2) cd interview-challenge
3) open 2 terminals, one should go to backend and the other one to frontend
4) npm i on both terminals
5) on backend, you should create a .env file that contains:
PORT = 4000
MONGODB_CONNECTION = (your atlas cluster)
TMDB_KEY = (Your tmdb api key)
Secret = (A jwt secret)
6) On the backend terminal: nodemon server
7) In this step, you will populate your database with movies from TMDB. Use postman or whatever you feel comfortable using, please follow this order
1. POST  localhost:4000/api/v1/populateGenres
2. POST  localhost:4000/api/v1/addDisplayMoviesToDB

If you need to change the amount of movies you are getting, go to the backend into moviePopulatorController, to the function addMoviesToDB. You can change
the value that says await getDisplayMovies(100), 100 is set by default and usually takes around 30-40 seconds to populate the database, you only need to do 
this once.

7) On the frontend terminal: npm run dev

8) You are good to go! Start adding movies to your watchlist, or create them directly on your watchlist. Don't forget to  

If you would prefer to use my atlas cluster, along with my TMDB api key, please let me know so that I can forward you the .env file

------------------SECOND---------------------------

API endpoints 

/api/v1/
   ├── /movies (protected by auser authentication)
   │   ├── GET / (list, pagination, filters)
   │   ├── GET /:id (details)
   │   ├── POST / (create)
   │   ├── PUT /:id (update)
   │   └── DELETE /:id (remove)
   ├── /genres
   │   └── GET / (list all genres)
   ├── /displaymovies (protected by auser authentication)
   │   ├── GET / (list, pagination, filters)
   │   ├── GET /:id (details)
   │   ├── POST / (create)
   │   ├── PUT /:id (update)
   │   └── DELETE /:id (remove)
   ├── /addDisplayMoviesToDB (Should be protected by an admin account, however, it has yet to be implemented)
   │   └── POST / (populate movies for display)
   ├── /cleanDisplayMovies (Should be protected by an admin account, however, it has yet to be implemented)
   │   └── DELETE / (remove all display movies)
   ├── /populateGenres (Should be protected by an admin account, however, it has yet to be implemented)
   │   └── POST / (populate genres)
   ├── /cleanGenres (Should be protected by an admin account, however, it has yet to be implemented)
   │   └── DELETE / (remove all genres)
   ├── /login
   │   └── POST / (user login)
   ├── /signup
   │   └── POST / (user signup)

------------------THIRD---------------------------

1. Interactive and Responsive UI
 -Homepage:
 -Displays movies extracted from TMDB, showing:
 -Poster
 -TMDB Rating
 -Option to add movies to the watchlist.
 -Search Bar:
 -Allows users to search movies by title.
 -Authentication:
 -Login and signup using JWT for secure access.
2. Watchlist Functionality
Filters:
 -Filter movies by:
  -Genre
  -Rating
  -Watched/Not Watched status.
Movie Details:
 -Displays:
  -Genres
  -User's own rating
  -Release year.
Movie Actions:
 -Rate: Add your own rating for each movie.
 -Toggle Watched: Mark movies as watched or not watched.
 -Delete: Remove movies from your watchlist.
3. Pagination Support
Both the homepage and watchlist support pagination for better navigation of movie collections.
4. Create Your Own Movie
Navigate to the Create New page from the watchlist:
Add personal movies to the watchlist.
These movies remain unique to your account and are not added to the display movies.

------------------FOURTH---------------------------

Technical decisions:

Before the reasoning for every decision, I have to comment that every choice on this architecture was mostly decided by how comfortable I felt using the tool, and at what rate I knew I was able to make it work, as opposed to something I wasn't as confident of pulling off. 

1. Authentication
JWT (JSON Web Token):
Chosen for its speed, simplicity, and reliability.
Seamlessly integrates with the MERN stack.
Provides secure, stateless user authentication.

2. Database
MongoDB:
Easy to setup
Availability of a free cluster, enough for a small project.
Scalability and speed, ensuring future growth if needed.

3. Backend
Express.js:
Lightweight and flexible Node.js framework.
Fast way to create a RESTful API.

4. Frontend
   
React.js
Component-based architecture, as I needed to create a lot of components.
Easy state management.
Ability to build a responsive and interactive UI efficiently.

Tailwindcss

Less verbose than css.
Fast and integrated responsive design.
Ensured consistent designs without writing custom CSS from scratch.

   

