const router = require("express").Router();
const authCustomer = require("../controllers/customerMiddleware");
const authOwner = require("../controllers/ownerMiddleware");
const verify = require("./verification");
const restuarant = require("../controllers/restaurant");
const dotenv = require("dotenv");
dotenv.config();

router.get("/welcome", (req, res) => {
  res.send("hello there");
});

router.post("/customer/signin", authCustomer.customerLoginCheck);

router.post("/customer/signup", authCustomer.customerRegistration);

router.get(
  "/customer/signin/me",
  [verify.verifyAccessToken, verify.isCustomer],
  (req, res) => {
    res.send({ message: "ACCESS GRANTED", data: req.payload });
  }
);
router.delete(
  "/customer/signin/me/logout",
  [verify.verifyAccessToken, verify.isCustomer],
  authCustomer.customerLogout,
  (req, res) => {
    res.send("Logged out");
  }
);

router.delete(
  "/customer/signin/me/deleteAccount",
  [verify.verifyAccessToken, verify.isCustomer],
  authCustomer.customerDeleteAccount
);

router.post("/owner/signin", authOwner.ownerLoginCheck, (req, res, next) => {
  next();
});

router.post("/owner/signup", authOwner.ownerRegistration);

module.exports = router;
