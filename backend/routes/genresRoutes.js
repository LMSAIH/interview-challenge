const Router = require("express").Router();

const genresRouterController = require('../controllers/genresRoutesController');

Router.get("/",genresRouterController.getGenres);

module.exports = Router;