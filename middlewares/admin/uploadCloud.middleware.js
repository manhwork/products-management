const multer = require("multer");
// https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
const upload = multer();

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET, // Click 'View API Keys' above to copy your API secret
});
// End Configuration

module.exports.Upload = async (req, res, next) => {
  if (req.file) {
    let streamUpload = async (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      req.body.thumbnail = result.url;
      // console.log(result);
      next();
    }

    upload(req);
  } else {
    next();
  }
};