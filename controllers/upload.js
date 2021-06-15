const multer = require("multer");

// define a filter to only allow images to pass.
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    console.log(req.file);
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

//configure multer to use Disk Storage engine
var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "../frontend/src/user");
  },

  filename: (req, file, cb) => {
    console.log(file);
    cb(null, `${Date.now()}-feast-${file.originalname}`);
  },
});

let uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;
