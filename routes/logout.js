const { application } = require("express");
const express = require("express");
const router = express.Router();

router.get("/", async function (req, res) {
    console.log("loggedout")
    res.clearCookie("jwt_token"); 
    res.status(200); 
    return res.json({msg:"Session terminated successfully!"})
  });

module.exports = router;