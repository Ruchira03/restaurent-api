const router = require("express").Router();
const verify = require('./verification');
const restaurant = require("../controllers/restaurant");
const upload = require('../controllers/upload');


router.post('/getRestaurantByLocation',[verify.verifyAccessToken,verify.isCustomer],restaurant.getRestaurantbyLocation);

router.post('/getRestaurantByName',[verify.verifyAccessToken,verify.isCustomer],restaurant.getRestaurantByName);

router.post('/addrestaurant',[verify.verifyAccessToken,verify.isOwner],restaurant.addRestaurant);

router.put('/addrestaurantimage',[verify.verifyAccessToken,verify.isOwner,verify.verifyRestaurant],upload.single('image'),restaurant.uploadFiles);

module.exports = router;