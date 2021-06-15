const router = require("express").Router();
const verify = require("./verification");
const order = require("../controllers/order");

router.put(
  "/orders",
  [
    
    verify.verifyAccessToken,
    verify.isOwner,
    verify.verifyRestaurant,
  ],
  order.startAcceptingOrders
);

router.post(
  "/checkout",
  [ verify.verifyAccessToken, verify.isCustomer],
  order.placeOrder
);

router.get(
  "/orders",
  [
  
    verify.verifyAccessToken,
    verify.isOwner,
    verify.verifyRestaurant,
  ],
  order.showOrders
);

router.put(
  "/orders/reject",
  [
   
    verify.verifyAccessToken,
    verify.isOwner,
    verify.verifyRestaurant,
  ],
  order.orderRejectance
);

router.put(
  "/orders/executed",
  [
   
    verify.verifyAccessToken,
    verify.isOwner,
    verify.verifyRestaurant,
  ],
  order.executedOrder
);

router.get(
  "/orderHistory",
  [ verify.verifyAccessToken, verify.isCustomer],
  order.orderHistory
);

module.exports = router;
