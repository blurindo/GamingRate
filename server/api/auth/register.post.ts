import { sendError } from "h3"
import { createUser } from "../../db/users.js"
import { userTransformer } from "~/server/transformers/user.js";
import {User} from "@prisma/client" 
import formidable, { Fields, File, Files  } from "formidable"
import { uploadImage } from "../../utils/cloudinary"

interface FormFields {
    username?: string | string[];
    email?: string | string[];
    password?: string | string[];
    repeatPassword?: string | string[];
    // Add other fields as necessary
}

interface FormFiles {
    [key: string]: formidable.File | formidable.File[] | undefined;
    // Define other file inputs as necessary
}

interface ILoginData {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
    formData: any;
}

export default defineEventHandler(async (event) => {
    const form = formidable({});
    
    const parsedData = await new Promise<{ fields: Fields, files: Files }>((resolve, reject) => {
        form.parse(event.node.req, (err, fields: Fields, files: Files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ fields, files });
        });
    });

    // Ensure fields are treated as strings, not arrays
    const fields: FormFields = parsedData.fields;
    const files: FormFiles = parsedData.files;

    const username = Array.isArray(fields.username) ? fields.username[0] : fields.username;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;
    const repeatPassword = Array.isArray(fields.repeatPassword) ? fields.repeatPassword[0] : fields.repeatPassword;


    if (!username || !email || !password || !repeatPassword) {
        return sendError(event, createError({statusCode: 400,
        statusMessage: 'Invalid params' }));
    }

    if (password !== repeatPassword)
    {
        return sendError(event, createError({statusCode: 400,
            statusMessage: 'Password do not match' }));
    }

    const uploadFiles = async (files: FormFiles) => {
        const uploadPromises = [];
    
        for (const key in files) {
            const fileOrFiles = files[key];
    
            if (Array.isArray(fileOrFiles)) {
                // Handle multiple files
                fileOrFiles.forEach(file => {
                    uploadPromises.push(uploadImage(file.filepath));
                });
            } else if (fileOrFiles) {
                // Handle a single file
                console.log(fileOrFiles)
                uploadPromises.push(uploadImage(fileOrFiles.filepath));
            }
        }
    
        // `Promise.all` will wait for all uploads to complete and return an array of URLs
        return await Promise.all(uploadPromises);
    };
    
    // Usage
    const uploadedUrls = await uploadFiles(files);

    const userData: Omit<User, "id" | "createdAt">  = {
        username,
        email,
        password,
        profileImage: uploadedUrls[0] || 'https://picsum.photos/200/200'
    }

    const user = await createUser(userData);

    return {
        body: userTransformer(user)
    }
})