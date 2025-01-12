const Genre = require("../models/Genre");

const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).json({ data: genres });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

module.exports = {getGenres};