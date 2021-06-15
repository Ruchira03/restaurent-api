const router = require("express").Router();
const verify = require("./verification");
const menu = require("../controllers/menu");

router.get(
  "/menu",
  [verify.verifyAccessToken, verify.isOwner, verify.verifyRestaurant],
  menu.showMenu
);

router.put(
  "/menu/:id",
  [verify.verifyAccessToken, verify.isOwner, verify.verifyRestaurant],
  menu.updateMenu
);

router.post(
  "/menu",
  [verify.verifyAccessToken, verify.isOwner, verify.verifyRestaurant],
  menu.addMenu
);

router.delete(
  "/menu/:id",
  [verify.verifyAccessToken, verify.isOwner, verify.verifyRestaurant],
  menu.deleteMenu
);

router.get(
  "/restaurants/:id",
  [verify.verifyAccessToken, verify.isCustomer],
  menu.getMenu
);

module.exports = router;
