const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const HttpError = require("./models/http-error");

app.use(bodyParser.json());

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin' , '*')
  res.setHeader('Access-Control-Allow-Headers' , '*')
  res.setHeader('Access-Control-Allow-Methods' , '*')
  next()
})

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Not Found", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSet) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Error" });
});

mongoose
  .connect("mongodb://localhost/mern")
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
