import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config({ 
    cloud_name: '', 
    api_key: '', 
    api_secret: '' // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (filePath) =>{
    try {
        if(!filePath) return null;

        const response  = await cloudinary.uploader.upload(filePath,{resource_type:'auto'});
        return response;
    } catch (error) {
        fs.unlinkSync(filePath);
        return null;
    }
}

export {uploadOnCloudinary};