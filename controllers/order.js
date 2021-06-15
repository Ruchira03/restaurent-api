const DB = require("../dbConnect");

var startAcceptingOrders = (req, res, next) => {
  const accepting_order = req.body.accepting_order;
  console.log(accepting_order);
  const id = req.payload.restaurant_id;
  DB.query(
    "UPDATE restaurant SET restaurant_accept_orders = ? WHERE restaurant_id = ?",
    [accepting_order, id],
    (err, result) => {
      if (err) throw err;
      else {
        res.send("updated successfully");
      }
      next();
    }
  );
};

var placeOrder = (req, res, next) => {
  console.log(req.body);
  const restaurant_id = req.body.restaurant_id;
  const user_id = req.payload.id;
  const product_id = req.body.product_id;
  const quantity = req.body.quantity;
  const total_price = req.body.total_price;
  const order_status = "PENDING";
  const order_date = Date.now();
  console.log(order_date);
  DB.query(
    "INSERT INTO `order` (ofk_user_id,ofk_product_id,order_quantity,order_total_price,order_status,order_date,ofk_restaurant_id) VALUES(?,?,?,?,?,CURRENT_DATE(),?)",
    [user_id, product_id, quantity, total_price, order_status, restaurant_id],
    (err, result) => {
      if (err) throw err;
      else {
        console.log(result);
        res.send("Order placed");
      }
      next();
    }
  );
};

var showOrders = (req, res, next) => {
  console.log("this is show orders..");
  const restaurant_id = req.payload.restaurant_id;
  console.log(restaurant_id);
  DB.query(
    'SELECT  restaurant.restaurant_accept_orders,order.order_id,order.ofk_user_id,order.ofk_product_id,order.order_quantity,order.order_total_price,order.order_status,order.order_date,order.ofk_restaurant_id,user.name, product.product_name,product.product_price FROM `order`INNER JOIN `restaurant` ON (order.ofk_restaurant_id=restaurant.restaurant_id AND order.ofk_restaurant_id=?) INNER JOIN `user` ON (order.ofk_user_id = user.id AND order.order_status="PENDING") INNER JOIN `product` ON order.ofk_product_id = product.product_id AND order.ofk_restaurant_id=?',
    [restaurant_id, restaurant_id],
    (err, result) => {
      if (err) throw err;
      else {
        console.log("hiii this is meee ruchira raksh");
        console.log(result);
        res.send(result);
      }
      next();
    }
  );
};
// 'SELECT  order.order_id,order.ofk_user_id,order.ofk_product_id,order.order_quantity,order.order_total_price,order.order_status,order.order_date,order.ofk_restaurant_id, user.name, product.product_name,product.product_price FROM `order` INNER JOIN `user` ON order.ofk_user_id = user.id AND order.order_status="PENDING" INNER JOIN `product` ON order.ofk_product_id = product.product_id AND order.ofk_restaurant_id=?',

//test file
// var showOrders = (req, res, next) => {
//   const restaurant_id = req.payload.restaurant_id;
//   console.log(" this is rest id : "+ restaurant_id);
//   DB.query(
//     `SELECT order.order_id,order.ofk_user_id,order.ofk_product_id,order.order_quantity,
//   order.order_total_price,order.order_status,order.order_date,order.ofk_restaurant_id,user.name,
//    product.product_name,product.product_price FROM order INNER JOIN user ON
//    order.ofk_user_id = user.id AND order.order_status="PENDING" INNER JOIN product ON
//    order.ofk_product_id = product.product_id AND product.pfk_restaurant_id=?`,
//     [restaurant_id],
//     (err, result) => {
//       if (err) throw err;
//       else {
//         res.send(result);
//       }
//       next();
//     }
//   );
// };

var orderRejectance = (req, res, next) => {
  let order_reject = req.body.order_reject;
  const order_id = req.body.order_id;
  if ((order_reject = "REJECT")) {
    DB.query(
      "UPDATE `order` SET order_status='REJECTED' WHERE order_id = ?",
      order_id,
      (err, result) => {
        if (err) throw err;
        else {
          res.send("Your Order Has Been Rejected");
        }
        next();
      }
    );
  } else {
    res.send("Your order has been accepted");
  }
};

var executedOrder = (req, res, next) => {
  const order_id = req.body.order_id;
  console.log(order_id);
  DB.query(
    "UPDATE `order` SET order_status = 'EXECUTED' WHERE order_id = ?",
    [order_id],
    (err, result) => {
      if (err) throw err;
      else {
        res.send("Your order has been executed");
      }
      next();
    }
  );
};

var orderHistory = (req, res, next) => {
  const user_id = req.payload.id;
  console.log("this is " + user_id);
  DB.query(
    "SELECT order.order_id,order.ofk_product_id,order.order_status,order.order_date,order.order_quantity,order.order_total_price,order.ofk_restaurant_id,restaurant.restaurant_name,product.product_name,product.product_price FROM `order` INNER JOIN `restaurant` ON order.ofk_restaurant_id=restaurant.restaurant_id AND order.ofk_user_id=? INNER JOIN `product`ON order.ofk_product_id = product.product_id",
    [user_id],
    (err, result) => {
      if (err) throw err;
      else {
        res.send(result);
      }
      next();
    }
  );
};

const Order = {};
Order.startAcceptingOrders = startAcceptingOrders;
Order.placeOrder = placeOrder;
Order.showOrders = showOrders;
Order.orderRejectance = orderRejectance;
Order.executedOrder = executedOrder;
Order.orderHistory = orderHistory;
module.exports = Order;
