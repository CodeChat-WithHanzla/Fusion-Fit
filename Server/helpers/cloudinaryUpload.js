const cloudinary = require('../config/cloudinaryConfig');
// Function to upload an image to Cloudinary
const uploadToCloudinary = async (fileBuffer, folder) => {
  try {
      const result = await cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
              if (error) throw error;
              return result;
          }
      );
      return result;
  } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
  }
};

  
  // Function to delete an image from Cloudinary by its public_id
  const deleteFromCloudinary = async (public_id) => {
    try {
      await cloudinary.uploader.destroy(public_id);
      console.log(`Image with public_id ${public_id} deleted from Cloudinary`);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw error;
    }
  };
  
  module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
  };