const express = require("express");  
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

router.get("/", async function (req, res) {
//   if (req.cookies.jwt_token) res.redirect("/home");
//   else 
res.render("login");
});

router.post("/", async function (req, res) {
  const { email, password } = req.body;
  // let value = {}
  try {
    value = await loginSchema.validateAsync({ email, password });
  } catch (error) {
    const errorMsg = {
      msg: error.details[0].message,
      details: req.body,
      errorCode: 0,
    };
    console.log(errorMsg);
    return res.render("login", { err: errorMsg });
  }
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    const errorMsg = {
      msg: "Invalid username or password",
      details: req.body,
      errorCode: 0,
    };
    console.log(errorMsg);
    return res.render("login", { err: errorMsg });
  }

  const resultofsalt = await bcrypt.compare(req.body.password, user.password);
  if (!resultofsalt) {
    const errorMsg = {
      msg: "Invalid username or password",
      details: req.body,
      errorCode: 0,
    };
    console.log(errorMsg);
    return res.render("login", { err: errorMsg });
  }
  const token = user.generateToken();
  res.cookie("jwt_token", token, { maxAge: 604800000 });
  res.redirect("/home");
});
router.get("/logout", (req, res) => {
  res.clearCookie("jwt_token");
  res.redirect("/auth");
});
module.exports = router;