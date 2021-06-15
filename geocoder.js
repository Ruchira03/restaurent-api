const NodeGeocoder = require("node-geocoder");
const dotenv = require("dotenv");
dotenv.config();

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
  country: "India",
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
