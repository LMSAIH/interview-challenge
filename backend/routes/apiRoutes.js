const Router = require("express").Router();
const DisplayMovie = require("../models/DisplayMovie");
const Genre = require("../models/Genre");
const requireAuth = require('../middleware/RequireAuth');
const apiRoutesController = require('../controllers/apiRoutesController');

Router.use(requireAuth);

Router.get("/", apiRoutesController.getMovies);

Router.get("/:id", apiRoutesController.getWithId);

Router.post("/", apiRoutesController.createMovie);

Router.put("/:id", apiRoutesController.updateMovie);

Router.delete("/:id", apiRoutesController.deleteMovie);

module.exports = Router;
