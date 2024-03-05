import { rejectFriendRequest } from "~/server/db/friendRequests"

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { receiverId, requestId } = body;

    const res = await rejectFriendRequest(receiverId, requestId);

    return res;
})