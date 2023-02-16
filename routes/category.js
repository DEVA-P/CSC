const { application } = require("express");
const express = require("express");
const router = express.Router();
const sessionValidation = require("../Services/middleware/sessionValidation");
const client = require("../db");

router.get("/", sessionValidation, async function (req, res) {
  let result;
  try {
    result = await client.query(`select * from category`); 
    console.log("rows afftectes", result.rowCount); 

  } catch (error) {
    console.log(error)
    console.log(error.detail);
    res.status(422);
    return res.json({ msg: error.detail , success: 0});
  }
  res.render("category", { user: req.user, category : result.rows, success: 1});
});

router.post("/addNewCategory", sessionValidation, async function (req, res) {
  let category = req.body;
  let result;
  console.log("req.body", req.body);

  try {
    const check_category_exists = await client.query(`select * from category where categorycode= $1 or categoryname = $2`,
      [category.categorycode, category.categoryname]);

    if (check_category_exists.rowCount > 0) {
      res.status(400);
      return res.json({ msg: "The given category code already exists!" });
    }
    result = await client.query(
      `insert into category(categorycode, categoryname) 
            values($1, $2)`,
      [category.categorycode, category.categoryname]
    );

    // console.log(result);
    console.log("rows afftectes", result.rowCount);
    return res.json({
      msg: result,
    });

  } catch (error) {
    console.log(error)
    console.log(error.detail);
    res.status(422);
    return res.json({ msg: error.detail });
  }
});


router.put("/", sessionValidation, async function (req, res) {
  let category = req.body;
  console.log(category); 
  
  try {
    const result = await client.query(`UPDATE category SET categoryname=$1, categorycode=$2 WHERE categoryid= $3;`, 
    [
      category.category_name,
      category.category_code,
      category.category_id,
    ]);
    console.log("rows afftectes", result.rowCount);
    console.log(result)
    return res.json({
      msg: result,
    });
  } catch (error) {
    console.log(error.detail);
    res.status(422);
    return res.json({ msg: error.detail });
  }
});

router.delete("/", sessionValidation, async (req, res) => {
  const category_id = req.body.category_id;
  try {
    const check_category_exists = await client.query(`select * from category where categoryid = $1`, [category_id]);  
        console.log(check_category_exists.rowCount)
        if (check_category_exists.rowCount <= 0 ) {
            res.status(400);
            return res.json({ msg: "The given category does not exists!" });
        }
            result = await client.query(
            `delete from category where categoryid = $1`,[category_id]); 
            console.log("rows deleted", result.rowCount);
      res.status(200);
      return res.json({
        msg: result,
      });
  } catch (error) {
      console.log(error.detail);
      res.status(422);
      return res.json({ msg: error.detail });
  }
});


router.get("/:id", sessionValidation, async function (req, res) {
  let result;
  let category_id = req.params.id;
  console.log(category_id);
  try {
    result = await client.query(`select * from category where categoryid=$1`, [
      category_id,
    ]);
    console.log("rows afftectes", result.rowCount);
  } catch (error) {
    console.log(error);
    console.log(error.detail);
    res.status(422);
    return res.json({ msg: error.detail, success: 0 });
  }
  if (result.rowCount <= 0) {
    res.status(400);
    return res.json({ msg: "The given category does not exists!" });
  }
  // console.log(result.rows[0]);
  return res.json({ msg: result.rows[0] });
});

module.exports = router;





    // try {
    //   value = await courseSchema.validateAsync(value);
    // } catch (err) {
    //   res.status(400);
    //   console.log("Err:" + err.details[0].message);
    //   return res.json({ msg: err.details[0].message });
    // }