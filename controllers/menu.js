const DB = require("../dbConnect");

var showMenu = (req, res, next) => {
  const restaurant_id = req.payload.restaurant_id;

  DB.query(
    "SELECT restaurant.restaurant_accept_orders,product.product_id,product.product_name,product.product_description,product.product_price,product.product_available,product.pfk_restaurant_id FROM `product` INNER JOIN `restaurant` ON product.pfk_restaurant_id=restaurant.restaurant_id AND product.pfk_restaurant_id=?",
    restaurant_id,
    (err, result) => {
      if (err) throw err;
      else {
        // console.log(result)
        res.send(result);
      }
      next();
    }
  );
};

var addMenu = (req, res, next) => {
  const restaurant_id = req.payload.restaurant_id;
  const data = [
    req.body.productName,
    req.body.productDescription,
    req.body.productPrice,
    req.body.productAvailable,
    restaurant_id,
  ];
  DB.query(
    "INSERT INTO product (product_name,product_description,product_price,product_available,pfk_restaurant_id)VALUES(?,?,?,?,?)",
    data,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error machha");
      } else {
        res.status(200).send("Added successfully");
      }
      next();
    }
  );
};

var updateMenu = (req, res, next) => {
  const id = req.params.id;

  const name = req.body.productName;
  const description = req.body.productDescription;
  const price = req.body.productPrice;
  const isAvailable = req.body.productAvailable;
  DB.query(
    "UPDATE product SET product_name = ?, product_description = ?, product_price = ?, product_available = ? WHERE product_id = ?",
    [name, description, price, isAvailable, id],
    (err, result) => {
      if (err) throw err;
      else {
        res.send("Updated!");
      }
      next();
    }
  );
};

var deleteMenu = (req, res, next) => {
  const restaurant_id = req.payload.restaurant_id;
  DB.query(
    "DELETE FROM product WHERE product_id=? AND pfk_restaurant_id=?",
    [req.params.id, restaurant_id],
    (err, result) => {
      if (err) throw err;
      else {
        res.send(result);
      }
      next();
    }
  );
};

var getMenu = (req, res, next) => {
  console.log(req.params.id);
  DB.query(
    "SELECT * FROM product WHERE pfk_restaurant_id = ?",
    req.params.id,
    (err, result) => {
      if (err) throw err;
      else {
        console.log(result);
        DB.query(
          "SELECT review.review_id,review.rating,review.review_comment,user.name FROM review INNER JOIN `user` ON  rfk_restaurant_id = ? AND review.rfk_user_id = user.id ",
          req.params.id,
          (err, value) => {
            if (err) throw err;
            else {
              DB.query(
                "SELECT AVG(rating) AS rating, COUNT(rating) AS no_of_ratings FROM review GROUP BY rfk_restaurant_id HAVING rfk_restaurant_id=?",
                req.params.id,
                (err, val) => {
                  if (err) throw err;
                  else {
                    res.send({ menu: result, review: value, rating: val });
                  }
                  next();
                }
              );
            }
          }
        );
      }
    }
  );
};

const Menu = {};
Menu.showMenu = showMenu;
Menu.addMenu = addMenu;
Menu.getMenu = getMenu;
Menu.updateMenu = updateMenu;
Menu.deleteMenu = deleteMenu;
module.exports = Menu;
// "SELECT * FROM product WHERE pfk_restaurant_id=?",
