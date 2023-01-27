const { application } = require("express");
const express = require("express");
const router = express.Router();
const sessionValidation = require("../Services/middleware/sessionValidation");
const client = require("../db");

router.get("/", sessionValidation, async function (req, res) {
  let result;
  try {
    result = await client.query(`select * from product`); 
    console.log("rows afftectes", result.rowCount); 

  } catch (error) {
    console.log(error)
    console.log(error.detail);
    res.status(422);
    return res.json({ msg: error.detail , success: 0});
  }
  res.render("product", { user: req.user, product : result.rows, success: 1});
});

router.post("/addNewProduct",sessionValidation, async function (req, res) {
    let product = req.body;
    let result; 
    console.log(req.body);

    try { 
        const check_product_exists = await client.query(`select * from product where productcode= $1 or productname = $2 or printname= $3`, 
        [product.product_code, product.product_name, product.print_name]);  

        if (check_product_exists.length > 0 ) {
            res.status(400);
            return res.json({ msg: "The given product code already exists!" });
        }
            result = await client.query(
            `insert into product(productname, printname, productcode, taxperc, unit, saleprice, mrp, discount, costprice) 
            values($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [product.product_name, product.print_name, product.product_code, product.tax,  product.unit, product.selling_price, product.mrp, product.discount, product.cost_price]
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

module.exports = router;





    // try {
    //   value = await courseSchema.validateAsync(value);
    // } catch (err) {
    //   res.status(400);
    //   console.log("Err:" + err.details[0].message);
    //   return res.json({ msg: err.details[0].message });
    // }