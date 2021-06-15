const DB = require("../dbConnect");
const dotenv = require("dotenv");
const { schema } = require("../models/restuarant");
const shortid = require("shortid");
dotenv.config();
const geocoder = require("../geocoder");

var addRestaurant = (req, res, next) => {
  const owner_id = req.payload.id;

  DB.query(
    "SELECT fk_restaurant_id FROM owner WHERE owner_id=?",
    owner_id,
    (err, result) => {
      if (err) throw err;

      if (result[0].fk_restaurant_id != null) {
        res.send("RESTAURANT ALREADY REGISTERED");
      } else {
        const id = shortid.generate();
        const name = req.body.name;
        const address = req.body.address;
        const phone = req.body.phone;
        const description = req.body.description;
        const accept_orders = 1;

        geocoder
          .geocode(address)
          .then((location) => {
            console.log(location);
            const location_x = location[0].latitude;
            const location_y = location[0].longitude;

            DB.query(
              "INSERT INTO restaurant (restaurant_id,restaurant_name,restaurant_address,restaurant_phone,restaurant_description,latitude,longitude,restaurant_name_soundex,restaurant_accept_orders) VALUES(?,?,?,?,?,?,?,SOUNDEX_GENERATOR(?),?)",
              [
                id,
                name,
                address,
                phone,
                description,
                location_x,
                location_y,
                name,
                accept_orders,
              ],
              (err, result) => {
                if (err) throw err;
                else {
                  DB.query(
                    `UPDATE owner SET fk_restaurant_id='${id}' WHERE owner_id='${owner_id}'`,
                    (err, val) => {
                      if (err) console.log(err);
                      else {
                        res.send("registered successfully");
                      }
                      next();
                    }
                  );
                }
              }
            );
          })
          .catch((err) => {
            throw err;
          });
      }
    }
  );
};

const uploadFiles = (req, res, next) => {
  if (req.file == undefined) {
    return res.send(`You must select a file.`);
  }
  const image_path = req.file.path;
  const image_name = req.file.filename;
  const image_type = req.file.mimetype;
  const id = req.payload.restaurant_id;
  DB.query(
    "UPDATE restaurant SET restaurant_image_name=?,restaurant_image_type=?,restaurant_image_path=? WHERE restaurant_id = ?",
    [image_name, image_type, image_path, id],
    (err, result) => {
      if (err) {
        throw err;
        //res.send(`Error when trying upload images: ${err}`)
      } else {
        console.log(result);
        res.send(`File has been uploaded.`);
      }
      next();
    }
  );
};

var getRestaurantbyLocation = (req, res, next) => {
  const location = req.body.location;

  geocoder
    .geocode(location)
    .then((loc) => {
      const latitude = loc[0].latitude;
      const longitude = loc[0].longitude;
      DB.query(
        `SELECT * ,( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) )AS distance FROM restaurant HAVING distance < 25 ORDER BY distance LIMIT 0 , 35`,
        (err, result) => {
          if (err) throw err;
          else {
            res.send(result);
          }
          next();
        }
      );
    })
    .catch((err) => {
      throw err;
    });
};

var getRestaurantByName = (req, res, next) => {
  const name = req.body.name;
  let search_name = name.replace(/\s+/g, " ").trim();
  let array = search_name.split(" ");

  let res_array = [];

  function collect_result(array, callback) {
    for (let i = 0; i < array.length; i++) {
      function store(i, callback) {
        DB.query(
          `SELECT * FROM restaurant WHERE FIND_IN_SET(SOUNDEX(?),restaurant_name_soundex)>0`,
          array[i],
          (err, result) => {
            if (err) throw err;

            if (
              res_array.length == 0 &&
              i == array.length - 1 &&
              result.length == 0
            ) {
              res.send("No result found");
              next();
            } else if (result.length == 0 && i != array.length - 1) {
              return;
            } else {
              callback(result);
            }
          }
        );
      }
      store(i, function (response) {
        res_array.push(response);
        if (i == array.length - 1) {
          callback(res_array);
          return;
        }
      });
    }
  }
  collect_result(array, function (response) {
    var search_result = Array.prototype.concat.apply([], response);
    let unique = Array.from(new Set(search_result.map(JSON.stringify))).map(
      JSON.parse
    ); //creates a Set object using the stringified myData elements.
    res.send(unique); //create an array based on the elements of the created set using Array.from.
  });
};

const Restaurant = {};
Restaurant.addRestaurant = addRestaurant;
Restaurant.getRestaurantbyLocation = getRestaurantbyLocation;
Restaurant.getRestaurantByName = getRestaurantByName;
Restaurant.uploadFiles = uploadFiles;
module.exports = Restaurant;
