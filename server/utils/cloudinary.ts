import {v2 as _cloudinary } from "cloudinary"

const cloudinary = () => {
    const config = useRuntimeConfig();

        _cloudinary.config({
            cloud_name: config.cloudinaryCloudName,
            api_key: config.cloudinaryApiKey,
            api_secret: config.cloudinaryApiSecret,
            secure: true,
        })

    return _cloudinary
}

export const uploadImage = async (imagePath: any) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    try {
      // Upload the image
      const result = await cloudinary().uploader.upload(imagePath, options);
      return result.url;
    } catch (error) {
      console.error(error);
    }
};