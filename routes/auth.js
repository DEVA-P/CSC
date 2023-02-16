const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../db");

router.get("/", async function (req, res) {
  if (req.cookies && req.cookies.jwt_token) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});

router.post("/", async function (req, res) {
  const userName = req.body.userName;
  const password = req.body.password;
  console.log(req.body);

  try {
    // Search for a user with the given email and password
    const result = await client.query(
      "SELECT * FROM users WHERE userName = $1 AND password = $2",
      [userName, password]
    );

    // If the user is found, generate a JWT
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const payload = {
        userId: user.userid,
        userName: user.username,
        branchId: user.branchid,
        isAdmin: user.isadmin,
      };
      console.log(payload);
      const jwt_token = jwt.sign(payload, process.env.JWT_SECRET);

      // Send the JWT in the response
      console.log("login success", jwt_token);
      res
        .cookie("jwt_token", jwt_token, { maxAge: 604800000, httpOnly: true })
        // res.redirect("/home");
        .json({ jwt_token });
    } else {
      // If the user is not found, return an error
      console.log("login failure");
      res.status(401).json({ error: "Invalid userName or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
