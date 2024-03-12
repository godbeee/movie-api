const Movie = require("../my_data/movie");

const getAllTrendingMovies = (req, res) => {
  let perPage = 20;
  const page = req.query.page || 1;

  Movie.getAllMovieByTrending((movies) => {
    const index = perPage * page - perPage;
    const moviesPagination = movies.slice(index, index + perPage);
    return res.status(200).json({
      results: moviesPagination,
      page: page,
      total_pages: Math.ceil(movies.length / perPage),
    });
  });
};

const getAllTopRateMovies = (req, res) => {
  let perPage = 20;
  const page = req.query.page || 1;

  Movie.getAllMovieByTopRate((movies) => {
    const index = perPage * page - perPage;
    const moviesPagination = movies.slice(index, index + perPage);
    return res.status(200).json({
      results: moviesPagination,
      page: page,
      total_pages: Math.ceil(movies.length / perPage),
    });
  });
};

const getAllMoviesByGenre = (req, res) => {
  const genreId = req.params.genreId;

  let perPage = 20;
  const page = req.query.page || 1;

  Movie.getAllMovieByGenre(Number(genreId), (movies, name) => {
    if (name) {
      const index = perPage * page - perPage;
      const moviesPagination = movies.slice(index, index + perPage);
      return res.status(200).json({
        results: moviesPagination,
        page: page,
        total_pages: Math.ceil(movies.length / perPage),
        genre_name: name,
      });
    } else {
      return res.status(400).json({
        message: "Not found that gerne id",
      });
    }
  });
};

const getVideoOfMovie = (req, res) => {
  if (req.body.filmId) {
    return Movie.getVideoByID(Number(req.body.filmId), (video) => {
      if (video) {
        return res.status(200).json({
          status: "success",
          result: video,
        });
      } else {
        return res.status(404).json({
          status: "fail",
          result: null,
          message: "Not found video",
        });
      }
    });
  } else {
    return res.status(400).json({
      status: "fail",
      result: null,
      message: "Not found film_id parram",
    });
  }
};

const postSearchFilm = (req, res) => {
  let perPage = 8;
  const page = req.query.page || 1;

  const keyword = req.body.keyword;
  const language = req.query.language || "";
  const mediaType = req.query.mediaType || "";
  const year = req.query.year || "";
  const genreId = req.query.genreId || "";

  if (keyword) {
    Movie.getAllMoviesByKeyword(
      keyword,
      language,
      mediaType,
      year,
      genreId,
      (movies) => {
        const index = perPage * page - perPage;
        const moviesPagination = movies.slice(index, index + perPage);
        return res.status(200).json({
          results: moviesPagination,
          page: page,
          total_pages: Math.ceil(movies.length / perPage),
        });
      }
    );
  } else {
    return res.status(400).json({
      results: [],
      message: "Not found keyword parram",
    });
  }
};

exports.getAllTrendingMovies = getAllTrendingMovies;
exports.getAllTopRateMovies = getAllTopRateMovies;
exports.getAllMoviesByGenre = getAllMoviesByGenre;
exports.getVideoOfMovie = getVideoOfMovie;
exports.postSearchFilm = postSearchFilm;
