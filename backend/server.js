require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT;
const MONGODBCONNECTION = process.env.MONGODB_CONNECTION;
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
//used to populate but left as it may be needed in the future
const Population = require("./routes/moviePopulation");
const apiRoutes = require("./routes/apiRoutes");
const genresRoutes = require("./routes/genresRoutes");
const movieRoutes = require('./routes/movieUserRoutes');
const userRoutes = require('./routes/user');
const requireAuth = require('./middleware/RequireAuth');


app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(cors());
app.use("/api/v1", userRoutes );
app.use(requireAuth);
app.use("/api/v1",Population);
app.use("/api/v1/displaymovies",apiRoutes);
app.use("/api/v1/genres", genresRoutes );
app.use("/api/v1/movies", movieRoutes);

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