import { checkIfPersonIsFriend } from "~/server/db/friends";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { userId, friendId } = body;

    const isFriend = await checkIfPersonIsFriend(userId, friendId)

    if(isFriend) {
        return true;
    }
    else {
        return false;
    }
})