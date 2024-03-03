import { sendFriendRequest } from "~/server/db/friendRequests"

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { senderId, receiverId } = body;

    const res = await sendFriendRequest(senderId, receiverId);
})