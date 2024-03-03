import { getUserById } from "~/server/db/users"

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { userId } = body;

    const userDetails = await getUserById(userId);
    if ( userDetails) {
    const { password, ...userWithCorrectDetails } = userDetails;
        return userWithCorrectDetails;
    }
    else {
        return null;
    }
})