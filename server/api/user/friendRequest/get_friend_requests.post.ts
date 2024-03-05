import { fetchFriendRequests } from '~/server/db/friendRequests'

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { receiverId } = body;

    const res = await fetchFriendRequests(receiverId);

    return res;
})
