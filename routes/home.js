const { application } = require("express");
const express = require("express");
const router = express.Router();
const sessionValidation = require("../Services/middleware/sessionValidation");
const client = require("../db"); 


router.use("/", sessionValidation, async function (req, res) {
    let result;
    try {
      result = await client.query(`select * from product where branchid = $1`, [req.user.branchId]);
      // console.log("rows afftectes", result.rowCount);
    } catch (error) {
      console.log(error);
      console.log(error.detail);
      res.status(422);
      return res.json({ msg: error.detail, success: 0 });
    }
    // console.log(req.user)
    if(req.user.isAdmin == true) {
      let branch_detail = await client.query(`select branch_no, name from branch`); 
      return res.render("admin", { user: req.user, branch_detail: branch_detail.rows});
    }
    res.render("home", { user: req.user, product: result.rows, success: 1 });
});

module.exports = router; 