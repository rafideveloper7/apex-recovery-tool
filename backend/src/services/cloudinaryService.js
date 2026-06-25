const cloudinary = require('../config/cloudinary');

const uploadImage = async (fileBuffer, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(
      `data:${fileBuffer.mimetype};base64,${fileBuffer.buffer.toString('base64')}`,
      options
    );
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary.');
  }
};

module.exports = { uploadImage };