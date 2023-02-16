const express = require("express");
const app = express();
const https = require("https");
const authRoute = require("./routes/auth");
const logoutRoute = require("./routes/logout");
const productRoute = require("./routes/product");
const categoryRoute = require("./routes/category");
const billRoute = require("./routes/bill");
const homeRoute = require("./routes/home");
const sessionValidation = require("./Services/middleware/sessionValidation");
const client = require("./db");
const cookieParser = require("cookie-parser");

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use("/login", authRoute);
// app.use("/register", authRoute);
app.use("/logout", logoutRoute);
app.use("/product", productRoute);
app.use("/category", categoryRoute);
app.use("/bill", billRoute);
app.use("/", homeRoute);

const port = process.env.PORT || 8000;

client.connect(function (err) {
  if (err) throw err;
  app.listen(port, () => console.log(`Serve running on port ${port}`));
});

