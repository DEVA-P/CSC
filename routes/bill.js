const { application } = require("express");
const express = require("express");
const router = express.Router();
const sessionValidation = require("../Services/middleware/sessionValidation");
const client = require("../db");

router.get("/", sessionValidation, async function (req, res) {
  let result;
  try {
    result = await client.query(
      `select * from billdetail AS bd INNER JOIN BILL as b ON bd.bill_id = b.id where b.branch_id = $1`,
      [req.user.branchId]
    );
    console.log("rows afftectes", result.rowCount);
  } catch (error) {
    console.log(error);
    console.log(error.detail);
    res.status(422);
    return res.json({ msg: error.detail, success: 0 });
  }
  res.render("bill", { user: req.user, bill: result.rows, success: 1 });
});

router.get("/detail", sessionValidation, async function (req, res) {
  let result;
  try {
    if (req.user.idAdmin == true) {
      result = await client.query(`select * from bill`);
      res.json({ results: result.rows });
    } else {
      result = await client.query(`select * from bill where branch_id=$1`, [req.user.branchId]);
      res.json({ results: result.rows });
    }
  } catch (error) {
    console.log(error);
    console.log(error.detail);
    res.status(422);
    return res.json({ msg: error.detail, success: 0 });
  }
});

router.get("/graph", sessionValidation, async function (req, res) { 
    let result;
    try {
      if (req.user.isAdmin == true) { 
        result = await client.query(`select time, profit from bill`);  
        res.json({ results: result.rows });
      } 
    } catch (error) {
      console.log(error);
      console.log(error.detail);
      res.status(422);
      return res.json({ msg: error.detail, success: 0 });
    }
  });

router.post("/", sessionValidation, async function (req, res) {
  let bill = req.body;
  let result;
  console.log(req.body);

  try {
    result = await client.query(
      `insert into bill(branch_id, username, time, subtotal, adjustment, total) 
            values($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        req.user.branchId,
        req.user.userName,
        new Date().toLocaleString(),
        bill.sub_total,
        bill.ad_val,
        bill.total,
      ]
    );
    let bill_id = result.rows[0].id;
    if (result && result.rowCount == 1) {
      try {
        let total_profit = 0;
        let products = bill.tableValue;
        for (let i = 0; i < products.length; i++) {
          const product_detail = await client.query(
            `select * from product where productid= $1`,
            [products[i].productId]
          );
          if (product_detail.rowCount > 0) {
            let profit =
              products[i].rate * products[i].quantity -
              product_detail.rows[0].costprice * products[i].quantity;
            total_profit += profit;
            console.log("profit: " + profit);
            result = await client.query(
              `insert into billdetail(product_id, bill_id, serial_no, time, quantity, price, discount, amount, cost_price, selling_price, mrp, profit, tax, tax_type)
                        values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
              [
                products[i].productId,
                bill_id,
                products[i].serial_no,
                new Date().toLocaleString(),
                products[i].quantity,
                products[i].rate,
                products[i].discount,
                products[i].amount,
                product_detail.rows[0].costprice,
                product_detail.rows[0].saleprice,
                product_detail.rows[0].mrp,
                profit,
                products[i].tax,
                products[i].tax_type,
              ]
            );
          }
        }
        let adding_profit = await client.query(
          `update bill set profit = $1 where id = $2`,
          [total_profit, bill_id]
        );
        console.log("rows afftectes", result.rowCount);
        return res.json({
          msg: "Successfully inserted the bill",
        });
      } catch (error) {
        console.log(error);
        res.status(422);
        return res.json({ msg: error.detail });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(422);
    return res.json({ msg: error.detail });
  }
});

module.exports = router;
