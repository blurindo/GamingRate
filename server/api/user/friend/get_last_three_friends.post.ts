import { getListOfThreeFriends } from "~/server/db/friends";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { userId } = body;

    const friends = await getListOfThreeFriends(userId);

    const friendList = [
        ...friends?.friends || [],
        ...friends?.friendOf || []
    ]

    const firstFriends = friendList.slice(0, 3)

    return firstFriends;
})