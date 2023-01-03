const express = require("express");
const multer = require("multer");
const port = 3000;
const app = express();
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const fs = require("fs");
  
// Creating uploads folder if not already present
// In "uploads" folder we will temporarily upload
// image before uploading to cloudinary
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}
  
// Multer setup
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
  
var upload = multer({ storage: storage });
  
// Body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
  
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
  
// Cloudinary configuration
cloudinary.config({
    cloud_name: "dejsjrfxo",
    api_key: "113232776193653",
    api_secret: "YEcoxH6rg0rU8PR532l7SBnrLIs",
});


app.get("/", (req, res) => {
    res.send("Server is running");
  });

app.post("/upload", upload.single("file"), async (req, res) => {
    // const x = await cloudinary.uploader.destroy("uvwwclolvzkfye5ohuxy");
    const upload = await cloudinary.uploader.upload(req.file.path);
    
    return res.json({
      success: true,
      file: upload?.secure_url,
      upload
    });
  });

app.listen(3000);
