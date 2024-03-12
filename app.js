//import
const express = require("express");
const cors = require("cors");
const movieRoute = require("./routes/movie");
const path = require("path");
const fs = require("fs");

//init app
const app = express();

//middlequare
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//authorized
app.use("/", (req, res, next) => {
  const token = "8qlOkxz4wq";
  fs.readFile(
    path.join(path.dirname(require.main.filename), "data", "userToken.json"),
    (err, data) => {
      let users = [];
      if (!err) {
        users = JSON.parse(data);
      }
      const user = users.find((user) => user.token === token);
      if (user) {
        next();
      } else {
        res.status(401).json({
          message: "unauthorize",
        });
      }
    }
  );
});

//routes
app.use(movieRoute);

app.get("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

//port app
app.listen(5000);
