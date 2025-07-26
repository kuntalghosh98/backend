const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadImageToCloudinary = (buffer, folder = 'ecommerce') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        // Apply transformations to the URL
        const optimizedUrl = result.secure_url.replace(
          '/upload/',
          '/upload/w_1000,q_auto,f_auto/'
        );

        resolve({
          originalUrl: result.secure_url,
          optimizedUrl,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = uploadImageToCloudinary;
