const DB = require("../dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const schema = require("../models/owner");
const client = require("../init_redis");
const dotenv = require("dotenv");
const shortid = require("shortid");
dotenv.config();

var ownerRegistration = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const owner_id = shortid.generate();
  const owner_email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  //   DB.query(
  //     "CREATE TABLE IF NOT EXISTS owner (`owner_id varchar(15) NOT NULL ,`owner_name` varchar(45) NOT NULL, `owner_email` varchar(45) NOT NULL,`owner_password` varchar(500) NOT NULL,`fk_restaurant_id` varchar(45) DEFAULT NULL,PRIMARY KEY (`owner_id`),KEY `restaurant_id_idx` (`fk_restaurant_id`),CONSTRAINT `fk_restaurant_id` FOREIGN KEY (`fk_restaurant_id`) REFERENCES `restuarant` (`restaurant_id`) ON DELETE RESTRICT ON UPDATE CASCADE) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;"
  //   );

  DB.query(
    "SELECT * FROM owner WHERE owner_email=?",
    owner_email,
    (err, result) => {
      if (err) throw err;
      else if (result.length != 0) {
        res.send("Already registered");
      } else {
        const salt = 10;
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) console.log("error in hashing");
          else {
            DB.query(
              "INSERT INTO owner (owner_id,owner_email,owner_password,owner_name) VALUES(?,?,?,?)",
              [owner_id, owner_email, hash, name],
              (err, result) => {
                if (err) throw err;
                else {
                  const payload = { id: owner_id, email: owner_email };
                  const secret = process.env.SECRET_KEY;
                  const accessToken = jwt.sign(payload, secret, {
                    expiresIn: "1y",
                  });
                  // jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn: '1y'},(err,token)=>{
                  //     if(err){
                  //         res.send(err);
                  //     }
                  //     else{
                  //         const refreshToken = token;
                  //         client.SET(payload.id,refreshToken,'EX',24*60*60,(err,response)=>{
                  //             if(err) throw err;
                  //             else{
                  //                 res.header({'x-access-token':accessToken,'x-refresh-token':refreshToken});
                  //                 res.send({message:"REGISTERED SUCCESSFULLY",data: result, accessToken : accessToken, refreshToken: refreshToken});
                  //             }
                  //             next();
                  //         })
                  //     }
                  // })

                  res.send({
                    role: "owner",
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
    }
  );
};

var ownerLoginCheck = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  DB.query(
    "SELECT * FROM owner WHERE owner_email=?",
    [email],
    (err, result) => {
      if (err) {
        console.log({ Error, message: "error is here" });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].owner_password, (err, response) => {
          if (err) console.log({ Error });
          if (response) {
            const payload = {
              id: result[0].owner_id,
              email: result[0].owner_email,
            };
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
            //       res.send(err);
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
            //             res.send({
            //               message: "LOGGED IN SUCCESSFULLY",
            //               data: result,
            //               accessToken: accessToken,
            //               refreshToken: refreshToken,
            //             });
            //             next();
            //           }
            //         }
            //       );
            //     }
            //   }
            // );
            res.send({
              role: "owner",
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
    }
  );
};

var ownerLogout = (req, res) => {
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

var ownerDeleteAccount = (req, res, next) => {
  const refreshToken = req.header("x-refresh-token");
  payload = jwt.decode(refreshToken);
  const id = payload.id;
  client.DEL(payload.id, (err, val) => {
    if (err) {
      console.log(err.message);
      res.send("Internal server error");
    }
    if (val == 1) {
      DB.query("DELETE FROM owner WHERE owner_id=?", [id], (err, result) => {
        if (err) throw err;
        else {
          res.sendStatus(204);
          next();
        }
      });
    } else {
      res.send("Invalid token");
    }
  });
};

const authOwner = {};
authOwner.ownerRegistration = ownerRegistration;
authOwner.ownerLoginCheck = ownerLoginCheck;
authOwner.ownerLogout = ownerLogout;
authOwner.ownerDeleteAccount = ownerDeleteAccount;
module.exports = authOwner;
