const express = require("express");
const movieController = require("../controllers/movieController");

const route = express.Router();

route.get("/api/movies/trending", movieController.getAllTrendingMovies);
route.get("/api/movies/top-rate", movieController.getAllTopRateMovies);
route.get("/api/movies/discover/", (req, res) => {
  res.status(400).json({
    message: "Not found gerne parram",
  });
});
route.get("/api/movies/discover/:genreId", movieController.getAllMoviesByGenre);
route.post("/api/movies/video", movieController.getVideoOfMovie);
route.post("/api/movies/search", movieController.postSearchFilm);

module.exports = route;
