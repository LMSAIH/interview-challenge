require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT;
const MONGODBCONNECTION = process.env.MONGODB_CONNECTION;
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
//used to populate but left as it may be needed in the future
const moviePopulation = require("./routes/moviePopulation");
const apiRoutes = require("./routes/apiRoutes");
const genresRoutes = require("./routes/genresRoutes");
const { applyTimestamps } = require("./models/Movie");

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(cors());
app.use("/api/v1",moviePopulation);
app.use("/api/v1/movies",apiRoutes);
app.use("/api/v1/genres", genresRoutes );


mongoose
  .connect(MONGODBCONNECTION)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });