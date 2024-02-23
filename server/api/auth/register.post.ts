import { sendError } from "h3"
import { createUser } from "../../db/users.js"
import { userTransformer } from "~/server/transformers/user.js";
import {User} from "@prisma/client" 

interface ILoginData {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
}

export default defineEventHandler(async (event) => {
    const body: ILoginData = await readBody(event);

    const {username, email, password, repeatPassword} = body;

    if (!username || !email || !password || !repeatPassword) {
        return sendError(event, createError({statusCode: 400,
        statusMessage: 'Invalid params' }));
    }

    if (password !== repeatPassword)
    {
        return sendError(event, createError({statusCode: 400,
            statusMessage: 'Password do not match' }));
    }

    const userData: Omit<User, "id" | "createdAt">  = {
        username,
        email,
        password,
        profileImage: 'https://picsum.photos/200/200'
    }

    const user = await createUser(userData);

    return {
        body: userTransformer(user)
    }
})