const jwt = require("jsonwebtoken");
const client = require("../init_redis");
const DB = require("../dbConnect");
const dotenv = require("dotenv");
dotenv.config();

// var verifyRefreshToken = (req, res, next) => {
//   const refreshToken = req.header("x-refresh-token");
//   if (!refreshToken)
//     return res.status(401).send("Access denied. No token provided.");

//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
//     if (err) res.send("Invalid token");

//     const userId = payload.id;
//     client.GET(userId, (err, result) => {
//       if (err) {
//         console.log(err.message);
//         res.send("server error");
//       }

//       if (refreshToken === result) {
//         next();
//       } else {
//         res.send("Invalid token");
//       }
//     });
//   });
// };

var verifyAccessToken = (req, res, next) => {
  const token = req.header("x-access-token");
  console.log("token");
  console.log(token);

  if (!token) return res.send("Access denied. No token provided.");

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) res.send("Invalid token.");
    else {
      req.payload = decoded;
      next();
    }
  });
};

var isCustomer = (req, res, next) => {
  const id = req.payload.id;
  DB.query("SELECT * FROM user WHERE id=?", [id], (err, result) => {
    if (err) console.log({ Error });

    if (result.length > 0) {
      next();
    } else {
      console.log(result);
      res.status(403).send("Need to be a customer");
    }
  });
};

var isOwner = (req, res, next) => {
  const id = req.payload.id;
  DB.query("SELECT * FROM owner WHERE owner_id=?", [id], (err, result) => {
    if (err) console.log({ Error });

    if (result.length > 0) {
      next();
    } else {
      console.log("neenu owner alla guru");
      res.status(403).send("Need to be an owner");
    }
  });
};

var isAdmin = (req, res, next) => {
  const id = req.payload.id;
  // console.log(id);
  DB.query("SELECT * FROM users WHERE id=?", [id], (err, result) => {
    if (err) console.log({ Error });

    if (result.length > 0) {
      if (result[0].admin == 1) {
        next();
      } else {
        res.status(403).send("Need to be have admin permission");
      }
    }
  });
};

var verifyRestaurant = (req, res, next) => {
  const owner_id = req.payload.id;
  DB.query(
    "SELECT fk_restaurant_id FROM owner WHERE owner_id=?",
    owner_id,
    (err, result) => {
      if (err) throw err;

      if (result[0].fk_restaurant_id == null) {
        console.log("neenu register madappa guru");
        res.status(403).send("REGISTER YOUR FOOD PLACE");
      } else {
        req.payload.restaurant_id = result[0].fk_restaurant_id;
        next();
      }
    }
  );
};
const verify = {};
//verify.verifyRefreshToken = verifyRefreshToken;
verify.verifyAccessToken = verifyAccessToken;
verify.isCustomer = isCustomer;
verify.isOwner = isOwner;
verify.isAdmin = isAdmin;
verify.verifyRestaurant = verifyRestaurant;
module.exports = verify;
