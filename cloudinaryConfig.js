const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'foodImage',
      allowed_formats: ['png', 'jpg', 'jpeg'],
    },
  });

  module.exports={
    storage
  };