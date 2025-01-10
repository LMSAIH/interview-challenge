const Router = require("express").Router();
const Movie = require("../models/Movie");
const Genre = require("../models/Genre");

const axios = require("axios");

const TMDB_API_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_KEY;

Router.get("/", async (req, res) => {
  try {
    //defaul values
    const {
      page = 1,
      limit = 15,
      search = "",
      genre,
      sortBy = "title",
      sortOrder = "asc",
      year,
    } = req.query;

    //convert to ints
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const filters = {};

    //ignore case
    if (search) {
      filters.title = { $regex: search, $options: "i" };
    }

    if (year) {
      const yearFilter = parseInt(year, 10);
      filters.releaseYear = yearFilter;
    }

    //query for genre, currently only supports one
    if (genre) {
      try {
        const queryGenre = await Genre.findOne({ name: genre });
        if (queryGenre) {
          filters.genres = queryGenre._id;
        } else {
          return res.status(404).json({ error: `Genre '${genre}' not found.` });
        }
      } catch (err) {
        console.error("Error fetching genre:", err);
        return res.status(500).json({ error: "Error fetching genre data." });
      }
    }

    //sort options, in case the order is descinding change it
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    //array of movies with the ones that fit the filters
    const movies = await Movie.find(filters)
      .populate("genres")
      .sort(sortOptions)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalMovies = await Movie.countDocuments(filters);

    res.json({
      data: movies,
      meta: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalMovies / pageSize),
        totalMovies,
      },
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

Router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const movie = await Movie.findById(id).populate("genres");

    if (!movie) {
      return res.status(404).json({ message: "movie not found" });
    }

    res.status(200).json({ data: movie });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const retrieveGenres = async () => {
  try {
    const genres = await Genre.find();

    return genres;
  } catch (err) {
    console.error(err);
  }
};

const matchedGenres = (genresByString, genresByObject) => {
  const matched = [];

  for (let i = 0; i < genresByString.length; i++) {
    const genreName = genresByString[i];

    for (let j = 0; j < genresByObject.length; j++) {
      const genre = genresByObject[j];

      if (genre && genre.name === genreName) {
        matched.push(genre);
        break;
      }
    }
  }

  return matched;
};

Router.post("/", async (req, res) => {
  const { title, releaseYear, genres, watched, rating, poster } = req.body;

  try {
    if (!title) {
      throw new Error("Missing title");
    }

    if (!releaseYear) {
      throw new Error("Missing release year");
    }
    if (!genres) {
      throw new Error("Missing genres");
    }
    if (!watched) {
      throw new Error("Missing whether it was watched or not");
    }
    if (!rating) {
      throw new Error("Missing rating");
    }

    if (!poster) {
      throw new Error("Missing poster");
    }

    let listOfGenres = await retrieveGenres();
    listOfGenres = matchedGenres(genres, listOfGenres);

    for (let i = 0; i < genres.length; i++) {}

    const movie = new Movie({
      title,
      releaseYear,
      genres: listOfGenres,
      watched,
      rating,
      poster,
    });

    await movie.save();
    res.status(201).json({ data: movie });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

Router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (updates.genres) {
      const genres = updates.genres;

      let listOfGenres = await retrieveGenres();
      listOfGenres = matchedGenres(genres, listOfGenres);

      updates.genres = listOfGenres;
    }

    const updatedMovie = await Movie.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("genres");

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ data: updatedMovie });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

Router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const toDelete = await Movie.findByIdAndDelete(id);

    if(!toDelete){
        return res.status(404).json({message: "Movie not found"});
    }

    res.status(200).json({ message: "Deleted successfully", data: toDelete });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = Router;
