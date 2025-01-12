const Router = require("express").Router();
const DisplayMovie = require("../models/DisplayMovie");
const Genre = require("../models/Genre");
const requireAuth = require('../middleware/RequireAuth');
const axios = require("axios");

const TMDB_API_URL = "https://api.theDisplayMoviedb.org/3";
const API_KEY = process.env.TMDB_KEY;


Router.use(requireAuth);

Router.get("/", async (req, res) => {
  try {
    // Default values
    const {
      page = 1,
      limit = 15,
      search = "",
      genre,
      sortBy = "rating",
      sortOrder = "desc",
      year,
      minRating,
      maxRating,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const filters = {};

    if (search) {
      filters.title = { $regex: search, $options: "i" };
    }

    if (year) {
      const yearFilter = parseInt(year, 10);
      filters.releaseYear = yearFilter;
    }

    if (minRating || maxRating) {
      filters.rating = {};
      if (minRating) {
        filters.rating.$gte = parseFloat(minRating);
      }
      if (maxRating) {
        filters.rating.$lte = parseFloat(maxRating);
      }
    }

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

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const DisplayMovies = await DisplayMovie.find(filters)
      .populate("genres")
      .sort(sortOptions) // Sort movies
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalDisplayMovies = await DisplayMovie.countDocuments(filters);

    res.json({
      data: DisplayMovies,
      meta: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalDisplayMovies / pageSize),
        totalDisplayMovies,
      },
    });
  } catch (error) {
    console.error("Error fetching DisplayMovies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


Router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const DisplayMovie = await DisplayMovie.findById(id).populate("genres");

    if (!DisplayMovie) {
      return res.status(404).json({ message: "DisplayMovie not found" });
    }

    res.status(200).json({ data: DisplayMovie });
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

    const DisplayMovie = new DisplayMovie({
      title,
      releaseYear,
      genres: listOfGenres,
      watched,
      rating,
      poster,
    });

    await DisplayMovie.save();
    res.status(201).json({ data: DisplayMovie });
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

    const updatedDisplayMovie = await DisplayMovie.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("genres");

    if (!updatedDisplayMovie) {
      return res.status(404).json({ message: "DisplayMovie not found" });
    }

    res.status(200).json({ data: updatedDisplayMovie });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

Router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const toDelete = await DisplayMovie.findByIdAndDelete(id);

    if(!toDelete){
        return res.status(404).json({message: "DisplayMovie not found"});
    }

    res.status(200).json({ message: "Deleted successfully", data: toDelete });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = Router;
