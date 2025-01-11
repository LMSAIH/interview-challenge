const Router = require("express").Router();
const DisplayMovie = require("../models/DisplayMovie");
const Genre = require("../models/Genre");
const Movie = require("../models/Movie");

const axios = require("axios");

const TMDB_API_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_KEY;

async function getDisplayMoviesFromTMDb(page) {
  try {
    const response = await axios.get(
      `${TMDB_API_URL}/trending/movie/day?language=en-US?`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        params: {
          page: page,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching genres from TMDb:", error);
    throw new Error("Failed to retrieve genres");
  }
}

function convertGenresIdToString(genres, genresCodes) {
  if (!Array.isArray(genres) || !Array.isArray(genresCodes)) {
    throw new Error("Both genres and genresCodes must be arrays");
  }

  const genresMap = genresCodes.reduce((map, genre) => {
    map[genre.id] = genre.name;
    return map;
  }, {});

  return genres.map((genreId) => genresMap[genreId] || "Unknown");
}

const getGenres = async () => {
  const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";

  try {
    const genres = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    return genres.data.genres;
  } catch (err) {
    console.error("Error fetching movies from TMDb:", err);
    throw new Error("Failed to retrieve DisplayMovies");
  }
};

const getDisplayMovies = async (pages) => {
  try {
    let tmdbData = [];

    for (let i = 1; i <= pages; i++) {
      const pageData = await getDisplayMoviesFromTMDb(i);
      tmdbData.push(pageData);
    }

    return tmdbData;
  } catch (error) {
    console.error("Error fetching movies from TMDb:", error);
    throw new Error("Failed to retrieve DisplayMovies");
  }
};

Router.post("/addDisplayMoviesToDB", async (req, res) => {
  try {
    const DisplayMovies = await getDisplayMovies(1);
    const genresCodes = await getGenres();

    for (let i = 0; i < DisplayMovies.length; i++) {
      const pageResults = DisplayMovies[i].results;
      for (let j = 0; j < pageResults.length; j++) {
        const title = pageResults[j].title;
        const rate = pageResults[j].vote_average.toFixed(1);
        let releaseYear = pageResults[j].release_date;
        releaseYear = parseInt(releaseYear.slice(0, 4));

        if (isNaN(releaseYear)) {
          console.log("Not a Number " + releaseYear);
          continue;
        }

        const genresIds = pageResults[j].genre_ids;

        const genresNames = convertGenresIdToString(genresIds, genresCodes);

        const posterPath = `https://image.tmdb.org/t/p/w500${pageResults[j].poster_path}`;

        const genreObjects = await Promise.all(
          genresNames.map(async (name) => {
            const genre = await Genre.findOne({ name });
            return genre ? genre._id : null;
          })
        );

        const validGenres = genreObjects.filter((genre) => genre !== null);

        try {
          const existingDisplayMovie = await DisplayMovie.findOne({ title, releaseYear });
          if (!existingDisplayMovie) {
            const newDisplayMovie = new DisplayMovie({
              title,
              releaseYear,
              genres: validGenres,
              rating:rate,
              poster: posterPath,
            });
            await newDisplayMovie.save();
            console.log(`Movie ${title} added successfully.`);
          } else {
            console.log(`Movie ${title} already exists in the database.`);
          }
        } catch (err) {
          console.error(`Error adding Movie ${title}:`, err);
        }
      }
    }

    res.status(200).json({ message: "DisplayMovies added successfully." });
  } catch (error) {
    console.error("Error adding DisplayMovies to the database:", error);
    res.status(500).json({ message: error.message });
  }
});

Router.delete("/cleanDisplayMovies", async (req, res) => {
  try {
    const result = await DisplayMovie.deleteMany({});

    res.status(200).json({
      message: "All DisplayMovies have been deleted successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting DisplayMovies:", err);
    res
      .status(500)
      .json({ message: "Unable to clean DisplayMovies", error: err.message });
  }
});

Router.delete("/cleanGenres", async(req,res) =>{
    try {
        const result = await Genre.deleteMany({});
    
        res.status(200).json({
          message: "All genres have been deleted successfully.",
          deletedCount: result.deletedCount,
        });
      } catch (err) {
        console.error("Error deleting genres:", err);
        res
          .status(500)
          .json({ message: "Unable to clean genres", error: err.message });
      }
});

Router.post("/populateGenres", async (req, res) => {
  try {
    const genresCodes = await getGenres();
    console.log(genresCodes);

    for (let i = 0; i < genresCodes.length; i++) {
      const genreName = genresCodes[i].name;
      try {
        const existingGenre = await Genre.findOne({ name: genreName });

        if (!existingGenre) {
          await Genre.create({ name: genreName });
          console.log(`Genre ${genreName} added successfully.`);
        } else {
          console.log(`Genre ${genreName} already exists.`);
        }
      } catch (err) {
        console.error(`Error adding genre ${genreName}:`, err);
      }
    }

    res.status(200).json({ message: "Genres populated successfully." });
  } catch (err) {
    console.error("Error populating genres:", err);
    res.status(500).json({ message: "Unable to fulfill request" });
  }
});


module.exports = Router;
