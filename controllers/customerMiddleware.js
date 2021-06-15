const DB = require("../dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const schema = require("../models/customer");
const client = require("../init_redis");
const dotenv = require("dotenv");
const shortid = require("shortid");
dotenv.config();

var customerRegistration = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user_id = shortid.generate();
  const user_email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  DB.query("SELECT * FROM user WHERE email=?", user_email, (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      res.send({
        message: "Already registered.try logging in ..!",
      });
    } else {
      const salt = 10;
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) console.log("error in hashing");
        else {
          DB.query(
            "INSERT INTO user (id,email,password,name) VALUES(?,?,?,?)",
            [user_id, user_email, hash, name],
            (err, result) => {
              if (err) throw err;
              else {
                const payload = { id: user_id, email: user_email };
                const secret = process.env.SECRET_KEY;
                const accessToken = jwt.sign(payload, secret, {
                  expiresIn: "1d",
                });

                // jwt.sign(
                //   payload,
                //   process.env.REFRESH_TOKEN_SECRET,
                //   { expiresIn: "1y" },
                //   (err, token) => {
                //     if (err) {
                //       res.send(createError.InternalServerError());
                //     } else {
                //       const refreshToken = token;
                //       client.SET(
                //         payload.id,
                //         refreshToken,
                //         "EX",
                //         24 * 60 * 60,
                //         (err, response) => {
                //           if (err) throw err;
                //           else {
                //             res.header({
                //               "x-access-token": accessToken,
                //               "x-refresh-token": refreshToken,
                //             });

                //           }
                //           next();
                //         }
                //       );
                //     }
                //   }
                // );
                res.send({
                  message: "REGISTERED SUCCESSFULLY",
                  data: result,
                  accessToken: accessToken,
                  //refreshToken: refreshToken,
                });
              }
            }
          );
        }
      });
    }
  });
};

var customerLoginCheck = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  DB.query("SELECT * FROM user WHERE email=?", email, (err, result) => {
    if (err) {
      console.log({ Error, message: "error is here" });
    }

    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (err, response) => {
        if (err) console.log({ Error });
        if (response) {
          const payload = { id: result[0].id, email: result[0].email };
          const secret = process.env.SECRET_KEY;
          const accessToken = jwt.sign(payload, secret, {
            expiresIn: "1d",
          });
          // jwt.sign(
          //   payload,
          //   process.env.REFRESH_TOKEN_SECRET,
          //   { expiresIn: "1y" },
          //   (err, token) => {
          //     if (err) {
          //       res.send(createError.InternalServerError());
          //     } else {
          //       const refreshToken = token;
          //       client.SET(
          //         payload.id,
          //         refreshToken,
          //         "EX",
          //         24 * 60 * 60,
          //         (err, response) => {
          //           if (err) throw err;
          //           else {
          //             res.header({
          //               "x-access-token": accessToken,
          //               "x-refresh-token": refreshToken,
          //             });
          //           }
          //         }
          //       );
          //     }
          //   }
          // );
          res.json({
            role: "user",
            message: "LOGGED IN SUCCESSFULLY",
            data: result,
            accessToken: accessToken,
            //refreshToken: refreshToken,
          });
        } else res.send("Wrong email/password combination");
      });
    } else {
      res.send("Email not registered!!");
      next();
    }
  });
};

var customerLogout = (req, res) => {
  try {
    const refreshToken = req.header("x-refresh-token");

    payload = jwt.decode(refreshToken);

    client.DEL(payload.id, (err, val) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log(val);
      res.sendStatus(204);
    });
  } catch (error) {
    next(error);
  }
};

var customerDeleteAccount = (req, res, next) => {
  // const refreshToken = req.header("x-refresh-token");
  // payload = jwt.decode(refreshToken);
  // const id = payload.id;
  // client.DEL(payload.id, (err, val) => {
  //   if (err) {
  //     console.log(err.message);
  //     res.send("Internal server error");
  //   }
  // if (val == 1) {
  DB.query("DELETE FROM user WHERE id=?", [id], (err, result) => {
    if (err) throw err;
    else {
      res.sendStatus(204);
      next();
    }
  });
};

const authCustomer = {};
authCustomer.customerRegistration = customerRegistration;
authCustomer.customerLoginCheck = customerLoginCheck;
authCustomer.customerLogout = customerLogout;
authCustomer.customerDeleteAccount = customerDeleteAccount;
module.exports = authCustomer;
