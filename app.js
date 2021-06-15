const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
//global.__basedir = __dirname;
//import routes
const authroute = require("./routes/auth");
const restaurant = require("./routes/restaurant");
const menu = require("./routes/menu");
const order = require("./routes/order");
const review = require("./routes/review");

//route middelwares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/uploads",
  express.static(__dirname + "/resources/static/assets/uploads")
);
app.use("/api", authroute);
app.use("/api", restaurant);
app.use("/api", menu);
app.use("/api", order);
app.use("/api", review);

//listening
const port = process.env.PORT || 2000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
