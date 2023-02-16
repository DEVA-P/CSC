const { application } = require("express");
const express = require("express");
const router = express.Router();
const sessionValidation = require("../Services/middleware/sessionValidation");
const client = require("../db"); 

router.get("/", sessionValidation, async function (req, res) {
  let result;
  try {
    result = await client.query(`select * from product where branchid = $1`, [req.user.branchId]);
    console.log("rows afftectes", result.rowCount);
  } catch (error) {
    console.log(error);
    console.log(error.detail);
    res.status(422);
    return res.json({ msg: error.detail, success: 0 });
  }
  res.render("product", { user: req.user, product: result.rows, success: 1 });
});

router.post("/addNewProduct", sessionValidation, async function (req, res) {
  let product = req.body;
  let result;
  console.log(req.body);

  try {
    const check_product_exists = await client.query(
      `select * from product where productcode= $1 or productname = $2 or printname= $3`,
      [product.product_code, product.product_name, product.print_name]
    );

    if (check_product_exists.rowCount > 0) {
      res.status(400);
      return res.json({
        msg: "The given product already exists or matches the name, code and print name with existing product!",
      });
    }
    result = await client.query(
      `insert into product(productname, printname, productcode, taxperc, unit, saleprice, mrp, discount, costprice, branchid) 
            values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        product.product_name,
        product.print_name,
        product.product_code,
        product.tax,
        product.unit,
        product.selling_price,
        product.mrp,
        product.discount,
        product.cost_price,
        req.user.branchId
      ]
    );
    console.log("rows afftectes", result.rowCount);
    return res.json({
      msg: result,
    });
  } catch (error) {
    console.log(error.detail);
    res.status(422);
    return res.json({ msg: error.detail });
  }
});

router.put("/", sessionValidation, async function (req, res) {
  let product = req.body;
  console.log(product); 
  
  try {
    const result = await client.query(`UPDATE product SET productname=$1, printname=$2, productcode=$3, taxperc=$4, unit=$5, saleprice=$6, mrp=$7, discount=$8, costprice=$9, tax_type = $11 WHERE productid= $10;`, 
    [
      product.product_name,
      product.print_name,
      product.product_code,
      product.tax,
      product.unit,
      product.selling_price,
      product.mrp,
      product.discount,
      product.cost_price,
      product.product_id,
      product.tax_type
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
  const product_id = req.body.product_id;
  try {
    const check_product_exists = await client.query(
      `select * from product where productid = $1`,
      [product_id]
    );
    console.log(check_product_exists.rowCount);
    if (check_product_exists.rowCount <= 0) {
      res.status(400);
      return res.json({ msg: "The given product does not exists!" });
    }
    result = await client.query(`delete from product where productid = $1`, [
      product_id,
    ]);
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
  let product_id = req.params.id;
  console.log(product_id);
  try {
    result = await client.query(`select * from product where productid=$1`, [
      product_id,
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
    return res.json({ msg: "The given product does not exists!" });
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
