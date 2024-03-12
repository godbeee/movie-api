const fs = require("fs");
const path = require("path");
const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "movieList.json"
);
const p1 = path.join(
  path.dirname(require.main.filename),
  "data",
  "genreList.json"
);
const p2 = path.join(
  path.dirname(require.main.filename),
  "data",
  "videoList.json"
);

const Movie = {
  getAllMovieByTrending(cb) {
    fs.readFile(p, (err, data) => {
      let trendingMovies = [];
      if (!err) {
        trendingMovies = JSON.parse(data).sort(
          (a, b) => b.popularity - a.popularity
        );
      }
      cb(trendingMovies);
    });
  },
  getAllMovieByTopRate(cb) {
    fs.readFile(p, (err, data) => {
      let topRateMovies = [];
      if (!err) {
        topRateMovies = JSON.parse(data).sort(
          (a, b) => b.vote_average - a.vote_average
        );
      }
      cb(topRateMovies);
    });
  },
  getAllMovieByGenre(id, cb) {
    fs.readFile(p, (err, data) => {
      let movies = [];
      if (!err) {
        movies = JSON.parse(data);
      }
      movies = movies.filter((m) => m.genre_ids.includes(id));
      fs.readFile(p1, (err, data) => {
        let genres = [];
        if (!err) {
          genres = JSON.parse(data);
        }
        const genreName = genres.find((g) => g.id === id)?.name;
        if (genreName) {
          cb(movies, genreName);
        } else {
          cb([], null);
        }
      });
    });
  },
  getVideoByID(id, cb) {
    fs.readFile(p2, (err, data) => {
      let videoList = [];
      if (!err) {
        videoList = JSON.parse(data);
      }
      const videos = videoList.find((m) => m.id === id)?.videos;
      if (videos) {
        let temp = videos
          .filter((v) => v.official === true)
          .filter((v) => v.site === "YouTube");

        let isExist = temp.filter((v) => v.type === "Trailer");
        if (!isExist.length) {
          temp = temp.filter((v) => v.type === "Teaser");
          temp.sort((a, b) => {
            const c = new Date(a.published_at);
            const d = new Date(b.published_at);
            return c - d;
          });
          return cb(temp[0]);
        }
        isExist.sort((a, b) => {
          const c = new Date(a.published_at);
          const d = new Date(b.published_at);
          return c - d;
        });
        return cb(isExist[0]);
      } else {
        return cb(null);
      }
    });
  },
  getAllMoviesByKeyword(keyword, language, mediaType, year, genreId, cb) {
    fs.readFile(p, (err, data) => {
      let movies = [];
      if (!err) {
        movies = JSON.parse(data);
      }
      if (keyword) {
        let filterMovies = movies.filter(
          (m) =>
            m.overview.toLowerCase().includes(keyword.toLowerCase()) ||
            m.title?.toLowerCase().includes(keyword.toLowerCase())
        );
        if (language) {
          filterMovies = filterMovies.filter(
            (m) => m.original_language === language
          );
        }
        if (year) {
          filterMovies = filterMovies.filter((m) => {
            const yearMovie = new Date(m.release_date).getFullYear();
            return Number(year) === yearMovie;
          });
        }
        if (mediaType) {
          filterMovies = filterMovies.filter((m) => m.media_type === mediaType);
        }
        if (genreId) {
          filterMovies = filterMovies.filter((m) => {
            if (m.genre_ids.includes(Number(genreId))) {
              return true;
            }
            return false;
          });
        }
        cb(filterMovies);
      } else {
        cb(null);
      }
    });
  },
};

module.exports = Movie;
