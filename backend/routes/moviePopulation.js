const Router = require("express").Router();

const moviePopulatorController = require("../controllers/moviePopulatorController");

Router.post("/addDisplayMoviesToDB", moviePopulatorController.addMoviesToDB);

Router.delete("cleanDisplayMovies",moviePopulatorController.cleanDisplayMovies);

Router.post("/populateGenres", moviePopulatorController.populateGenres);

Router.delete("/cleanGenres", moviePopulatorController.cleanGenres);


module.exports = Router;
