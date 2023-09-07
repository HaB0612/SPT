var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var app = express();
const session = require("express-session");

const connectWithRetry = () => {
  mongoose.connect(
    "mongodb+srv://hasanbocek:MyHy197619@cloudapp.fawey.mongodb.net/HasanBocek?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    }
  );
  var db = mongoose.connection;
  db.on("open", () => {
    console.log("Connected to the MongoDB database.");
  });
  db.on("error", (err) => {
    console.log(`Database error: ${err}`);
    mongoose.connect(
      "mongodb+srv://hasanbocek:MyHy197619@cloudapp.fawey.mongodb.net/HasanBocek?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      }
    );
  });
};

connectWithRetry();
app.set("views", path.join(__dirname, "client/views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/views")));

app.use(
  session({
    secret: "gizli-bir-anahtar",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/api", require("./server/routes/index"));
app.use("/auth", require("./server/routes/auth"));
app.use("/", require("./client/view/index"));

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
