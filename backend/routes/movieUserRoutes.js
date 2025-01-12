const Router = require("express").Router();
const Movie = require("../models/Movie");
const Genre = require("../models/Genre");
const mongoose = require("mongoose");
const requireAuth = require("../middleware/RequireAuth");
const userMovieController = require('../controllers/userMoviesController')

Router.use(requireAuth);

Router.get("/", userMovieController.getMovies);

Router.get("/:id", userMovieController.getMovieById);



Router.post("/", userMovieController.createMovie);

Router.put("/:id", userMovieController.updateMovie);

Router.delete("/:id", userMovieController.deleteMovie);

module.exports = Router;
