const uploadImageToCloudinary = require('../utils/cloudinaryUpload');

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const folder = req.body.folder || 'ecommerce'; // optional from client
    const result = await uploadImageToCloudinary(file.buffer, folder);

    res.status(200).json({
      message: 'Upload successful',
      originalUrl: result.originalUrl,
      optimizedUrl: result.optimizedUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error });
  }
};
